// Astra's desktop pets geometry reader. OpenAI Codex (GPT-6), 2026-10-08.
// Read-only window/UIA integration: no application state files, input, or window changes.
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows.Automation;

namespace AstraDesktopPets {
  internal interface IPetDockSource : IDisposable {
    bool HasTarget { get; }
    Rectangle? Sample(bool revalidate);
  }

  // Callback runs on one background MTA worker. It must only queue/coalesce work;
  // never synchronously wait for the UI. Rectangle is the physical UIA Image frame.
  internal sealed class PetDockTracker : IDisposable {
    const int GeometryIntervalMs=200,DiscoveryIntervalMs=2000;
    readonly object gate=new object();
    readonly Action<Rectangle?> onBounds;
    readonly IPetDockSource source;
    readonly ManualResetEvent stop=new ManualResetEvent(false);
    bool started,disposed,published;
    Rectangle? previous;
    internal PetDockTracker(Action<Rectangle?> callback) : this(callback,new PetDockSource()) { }
    internal PetDockTracker(Action<Rectangle?> callback,IPetDockSource reader) {
      if(callback==null)throw new ArgumentNullException("callback");
      if(reader==null)throw new ArgumentNullException("reader");
      onBounds=callback;source=reader;
    }
    internal void Start() {
      lock(gate) {
        if(disposed)throw new ObjectDisposedException("PetDockTracker");
        if(started)return;
        started=true;
        var worker=new Thread(ReadLoop) { IsBackground=true,Name="Desktop pets BSOD geometry reader" };
        worker.SetApartmentState(ApartmentState.MTA);worker.Start();
      }
    }
    void Publish(Rectangle? bounds) {
      lock(gate) {
        if(disposed||(published&&Nullable.Equals(previous,bounds)))return;
        previous=bounds;published=true;
        // Callback is nonblocking in the pets window; serial delivery prevents a backlog here.
        try { onBounds(bounds); } catch(Exception) { }
      }
    }
    void ReadLoop() {
      var clock=Stopwatch.StartNew();long nextDiscovery=0;
      try {
        while(!stop.WaitOne(0)) {
          long began=clock.ElapsedMilliseconds;
          bool revalidate=began>=nextDiscovery;
          Rectangle? bounds=null;
          try {
            if(revalidate||source.HasTarget)bounds=source.Sample(revalidate);
          } catch(ElementNotAvailableException) { }
            catch(COMException) { }
            catch(InvalidOperationException) { }
            catch(ArgumentException) { }
            catch(System.ComponentModel.Win32Exception) { }
          long ended=clock.ElapsedMilliseconds;
          if(revalidate)nextDiscovery=ended+DiscoveryIntervalMs;
          // A slow provider response is old geometry; never deliver it as a fresh anchor.
          if(ended-began>DiscoveryIntervalMs)bounds=null;
          Publish(bounds);
          int delay=source.HasTarget?GeometryIntervalMs:DiscoveryIntervalMs;
          if(stop.WaitOne(delay))break;
        }
      } catch(Exception) { Publish(null); }
      finally { lock(gate) { disposed=true;source.Dispose();stop.Dispose(); } }
    }
    public void Dispose() {
      lock(gate) {
        if(disposed)return;
        disposed=true;stop.Set();
        // Never join a UIA call on the pets UI thread. The single worker owns cleanup.
        if(!started) { source.Dispose();stop.Dispose(); }
      }
    }
  }

  internal sealed class PetDockSource : IPetDockSource {
    IntPtr window;
    int owner;
    AutomationElement image;
    public bool HasTarget { get { return image!=null; } }
    public Rectangle? Sample(bool revalidate) {
      try {
        if(revalidate)Discover();
        if(image==null||!PetDockNative.IsMini(window,owner)) { Clear();return null; }
        if(!Equals(image.GetCurrentPropertyValue(AutomationElement.IsOffscreenProperty,true),false)) { Clear();return null; }
        var value=image.GetCurrentPropertyValue(AutomationElement.BoundingRectangleProperty,true);
        Rectangle bounds;
        if(!(value is System.Windows.Rect)||!ConvertBounds((System.Windows.Rect)value,out bounds)||!PetDockNative.IntersectsWindow(window,bounds)) { Clear();return null; }
        return bounds;
      } catch(ElementNotAvailableException) { Clear();return null; }
        catch(COMException) { Clear();return null; }
        catch(InvalidOperationException) { Clear();return null; }
        catch(ArgumentException) { Clear();return null; }
        catch(System.ComponentModel.Win32Exception) { Clear();return null; }
    }
    void Discover() {
      Clear();
      var ids=PetDockNative.DesktopIds();
      if(ids.Count==0)return;
      var candidates=PetDockNative.MiniWindows(ids);
      AutomationElement match=null;IntPtr matchWindow=IntPtr.Zero;int matchOwner=0;
      foreach(var candidate in candidates) {
        bool ambiguous;
        var found=ResolveImage(candidate.Key,candidate.Value,true,out ambiguous);
        if(ambiguous) { Clear();return; }
        if(found==null)continue;
        if(match!=null) { Clear();return; }
        match=found;matchWindow=candidate.Key;matchOwner=candidate.Value;
      }
      image=match;window=matchWindow;owner=matchOwner;
    }
    // Exposed internally so tests can validate only their own synthetic Image windows.
    internal static AutomationElement ResolveImage(IntPtr handle,int process,bool requireCodexClass,out bool ambiguous) {
      ambiguous=false;
      var root=AutomationElement.FromHandle(handle);
      if(root==null)return null;
      var request=new CacheRequest { TreeScope=TreeScope.Element,AutomationElementMode=AutomationElementMode.Full };
      foreach(var property in new [] { AutomationElement.NameProperty,AutomationElement.ProcessIdProperty,AutomationElement.ControlTypeProperty,AutomationElement.ClassNameProperty,AutomationElement.IsOffscreenProperty })request.Add(property);
      using(request.Activate()) {
        // Scope is an already verified packaged desktop mini, never the desktop tree.
        // Only the exact public pet Image name and its geometry/identity are requested.
        var found=root.FindAll(TreeScope.Descendants,new PropertyCondition(AutomationElement.NameProperty,"BSOD pet"));
        if(found.Count!=1) { ambiguous=found.Count>1;return null; }
        var item=found[0].Cached;
        if(item.Name!="BSOD pet"||item.ProcessId!=process||item.ControlType!=ControlType.Image||item.IsOffscreen)return null;
        if(requireCodexClass&&!item.ClassName.StartsWith("codex-avatar-button",StringComparison.Ordinal))return null;
        return found[0];
      }
    }
    internal static bool ConvertBounds(System.Windows.Rect frame,out Rectangle bounds) {
      bounds=Rectangle.Empty;
      if(frame.IsEmpty||frame.Width<=0||frame.Height<=0)return false;
      foreach(double value in new [] {frame.Left,frame.Top,frame.Right,frame.Bottom,frame.Width,frame.Height})if(Double.IsNaN(value)||Double.IsInfinity(value)||value<int.MinValue+1||value>int.MaxValue-1)return false;
      if(Math.Abs(frame.Width/frame.Height-192.0/208)>.08)return false;
      int left=(int)Math.Round(frame.Left),top=(int)Math.Round(frame.Top),right=(int)Math.Round(frame.Right),bottom=(int)Math.Round(frame.Bottom);
      if(right<=left||bottom<=top||(long)right-left>int.MaxValue||(long)bottom-top>int.MaxValue)return false;
      bounds=Rectangle.FromLTRB(left,top,right,bottom);return true;
    }
    void Clear() { image=null;window=IntPtr.Zero;owner=0; }
    public void Dispose() { Clear(); }
  }

  internal static class PetDockNative {
    internal delegate bool EnumWindowProc(IntPtr window,IntPtr parameter);
    [StructLayout(LayoutKind.Sequential)] struct NativeRect { internal int Left,Top,Right,Bottom; }
    [DllImport("user32.dll")] static extern bool EnumWindows(EnumWindowProc callback,IntPtr parameter);
    [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr window,out uint id);
    [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr window);
    [DllImport("user32.dll")] static extern bool IsIconic(IntPtr window);
    [DllImport("user32.dll")] static extern bool GetWindowRect(IntPtr window,out NativeRect rect);
    [DllImport("user32.dll")] static extern int GetWindowLong(IntPtr window,int index);
    [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern int GetClassName(IntPtr window,StringBuilder name,int max);
    [DllImport("dwmapi.dll")] static extern int DwmGetWindowAttribute(IntPtr window,int attribute,out int value,int size);
    [DllImport("kernel32.dll",CharSet=CharSet.Unicode)] static extern int GetPackageFullName(IntPtr process,ref uint length,StringBuilder name);
    internal static HashSet<int> DesktopIds() {
      var ids=new HashSet<int>();
      foreach(var name in new [] {"ChatGPT","Codex"}) {
        foreach(var process in Process.GetProcessesByName(name))using(process) {
          try {
            var path=process.MainModule.FileName;
            if(!IsCodexPackagePath(path)||!File.Exists(Path.Combine(Path.GetDirectoryName(path),"resources","app.asar")))continue;
            uint length=0;
            if(GetPackageFullName(process.Handle,ref length,null)!=122||length<1||length>4096)continue;
            var package=new StringBuilder((int)length);
            if(GetPackageFullName(process.Handle,ref length,package)==0&&package.ToString().StartsWith("OpenAI.Codex_",StringComparison.OrdinalIgnoreCase))ids.Add(process.Id);
          } catch(System.ComponentModel.Win32Exception) { }
            catch(InvalidOperationException) { }
            catch(IOException) { }
            catch(UnauthorizedAccessException) { }
        }
      }
      return ids;
    }
    internal static bool IsCodexPackagePath(string path) {
      if(String.IsNullOrEmpty(path))return false;
      var leaf=Path.GetFileName(path);
      return (String.Equals(leaf,"ChatGPT.exe",StringComparison.OrdinalIgnoreCase)||String.Equals(leaf,"Codex.exe",StringComparison.OrdinalIgnoreCase))&&path.IndexOf("\\WindowsApps\\OpenAI.Codex_",StringComparison.OrdinalIgnoreCase)>=0;
    }
    internal static bool IsMini(IntPtr window,int owner) {
      uint id;GetWindowThreadProcessId(window,out id);
      if(owner<=0||id!=(uint)owner||!IsWindowVisible(window)||IsIconic(window))return false;
      int cloaked;if(DwmGetWindowAttribute(window,14,out cloaked,4)!=0||cloaked!=0)return false;
      int style=GetWindowLong(window,-16),extra=GetWindowLong(window,-20);
      const int required=0x80|0x8|0x80000;
      if((extra&required)!=required||(style&0x00C00000)!=0)return false;
      var name=new StringBuilder(128);GetClassName(window,name,name.Capacity);
      return name.ToString()=="Chrome_WidgetWin_1";
    }
    internal static List<KeyValuePair<IntPtr,int>> MiniWindows(HashSet<int> owners) {
      var matches=new List<KeyValuePair<IntPtr,int>>();
      bool overflow=false;
      bool enumerated=EnumWindows(delegate(IntPtr window,IntPtr ignored) {
        uint id;GetWindowThreadProcessId(window,out id);
        if(owners.Contains((int)id)&&IsMini(window,(int)id)) {
          if(matches.Count>=16) { overflow=true;return false; }
          matches.Add(new KeyValuePair<IntPtr,int>(window,(int)id));
        }
        return true;
      },IntPtr.Zero);
      if(overflow||!enumerated)matches.Clear();
      return matches;
    }
    internal static bool IntersectsWindow(IntPtr window,Rectangle bounds) {
      NativeRect rect;
      return GetWindowRect(window,out rect)&&rect.Right>rect.Left&&rect.Bottom>rect.Top&&Rectangle.FromLTRB(rect.Left,rect.Top,rect.Right,rect.Bottom).IntersectsWith(bounds);
    }
  }
}
