using System;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Diagnostics;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.InteropServices;
using System.Text;
using System.Web.Script.Serialization;
using System.Windows.Forms;
using System.Windows.Automation;

namespace AstraPetApps {
  // Compatibility reader for Codex 26.1002. Does not write application state,
  // read conversations, send input, or change any other application's window.
  public sealed class FarmerDock : Form {
    public const double VisibleHeight = 58.75; // BSOD computer-case y57 to feet y198 at 80/192 scale.
    public const string WindowTitle = "Astra's Pet Apps - Farmer Dock";
    readonly string root;
    readonly bool testMode;
    readonly Timer timer = new Timer();
    readonly Bitmap idle, blink;
    readonly Rectangle crop;
    readonly LiveMiniTracker tracker;
    readonly Stopwatch animation = Stopwatch.StartNew();
    int placementQueued;
    bool paintedBlink;
    public string Status { get; private set; }
    public FarmerDock(string directory, bool test = false) {
      root = directory;
      testMode = test;
      var stateFile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".codex", ".codex-global-state.json");
      idle = DetachedBitmap(Path.Combine(root, "art", "frames", "farmer", "idle-20261008.png"));
      blink = DetachedBitmap(Path.Combine(root, "art", "frames", "farmer", "blink-20261008.png"));
      crop = AlphaBounds(idle);
      Text = testMode ? "Farmer Dock - visibility test" : WindowTitle;
      FormBorderStyle = testMode ? FormBorderStyle.FixedDialog : FormBorderStyle.None;
      ShowInTaskbar = testMode;
      StartPosition = FormStartPosition.Manual;
      AutoScaleMode = AutoScaleMode.None;
      TopMost = !testMode;
      BackColor = testMode ? Color.FromArgb(34,26,43) : Color.FromArgb(1,2,3);
      if (!testMode) TransparencyKey = BackColor;
      DoubleBuffered = true;
      ClientSize = testMode ? new Size(330,180) : new Size((int)Math.Ceiling(crop.Width * VisibleHeight / crop.Height),(int)Math.Round(VisibleHeight));
      var menu = new ContextMenuStrip();
      menu.Items.Add("Open Farmer's desk", null, (s,e) => OpenDesk());
      menu.Items.Add("Close desktop Farmer", null, (s,e) => Close());
      ContextMenuStrip = menu;
      MouseDoubleClick += (s,e) => { if(e.Button == MouseButtons.Left) OpenDesk(); };
      var tip = new ToolTip();
      tip.SetToolTip(this, "Friendly Farmer · double-click for the desk · right-click to close");
      // Create only our own hidden HWND before the worker can post updates.
      var ownHandle=Handle;
      tracker=new LiveMiniTracker(stateFile,!testMode);
      tracker.SampleChanged+=QueuePlacement;
      timer.Interval = 50;
      timer.Tick += (s,e) => {
        RefreshPosition();
        bool nowBlink=animation.ElapsedMilliseconds%6600>=2340&&animation.ElapsedMilliseconds%6600<3840;
        if(nowBlink!=paintedBlink) { paintedBlink=nowBlink;Invalidate(); }
      };
      timer.Start();
      FormClosed += (s,e) => { timer.Dispose();tracker.SampleChanged-=QueuePlacement;tracker.Dispose();idle.Dispose();blink.Dispose();tip.Dispose(); };
    }
    public static Bitmap DetachedBitmap(string path) {
      using (var stream = new FileStream(path,FileMode.Open,FileAccess.Read,FileShare.ReadWrite|FileShare.Delete))
      using (var original = Image.FromStream(stream)) return new Bitmap(original);
    }
    protected override bool ShowWithoutActivation { get { return !testMode; } }
    protected override CreateParams CreateParams {
      get { var value = base.CreateParams; if(!testMode)value.ExStyle |= 0x08000000 | 0x00000080; return value; }
    }
    public static Rectangle AlphaBounds(Bitmap image) {
      int left=image.Width,top=image.Height,right=-1,bottom=-1;
      for(int y=0;y<image.Height;y++) for(int x=0;x<image.Width;x++) if(image.GetPixel(x,y).A>0) {
        left=Math.Min(left,x);right=Math.Max(right,x);top=Math.Min(top,y);bottom=Math.Max(bottom,y);
      }
      if(right<left) throw new InvalidDataException("Farmer sprite is empty.");
      return Rectangle.FromLTRB(left,top,right+1,bottom+1);
    }
    void OpenDesk() {
      var file=Path.Combine(root,"apps","astras-pet-apps-20261008.html");
      if(!File.Exists(file)) file=Path.Combine(root,"cage.html");
      Process.Start(new ProcessStartInfo(file) { UseShellExecute=true });
    }
    void QueuePlacement() {
      if(IsDisposed||!IsHandleCreated||System.Threading.Interlocked.CompareExchange(ref placementQueued,1,0)!=0)return;
      try {
        BeginInvoke((Action)delegate {
          System.Threading.Interlocked.Exchange(ref placementQueued,0);
          if(!IsDisposed)PlaceFromLiveMini();
        });
      } catch(InvalidOperationException) { System.Threading.Interlocked.Exchange(ref placementQueued,0); }
    }
    public void RefreshPosition() {
      if(testMode) {
        if(!Visible) { var screen=Screen.PrimaryScreen.WorkingArea;Location=new Point(screen.Left+(screen.Width-Width)/2,screen.Top+(screen.Height-Height)/2);Show(); }
        return;
      }
      // The UI path reads no settings or processes. The worker receives only
      // this display geometry; file access, discovery and UIA stay off the UI.
      tracker.ConfigureScreen(Screen.PrimaryScreen.Bounds,Screen.AllScreens.Length==1);
      PlaceFromLiveMini();
    }
    void PlaceFromLiveMini() {
      if(Screen.AllScreens.Length!=1) { Hide();NativeDock.SetProp(Handle,NativeDock.LiveProperty,IntPtr.Zero);return; }
      RectangleF frame;double scale;long queryStarted;
      if(!tracker.TryGet(out frame,out scale,out queryStarted)) {
        Status=tracker.Status;Hide();
        NativeDock.SetProp(Handle,NativeDock.LiveProperty,IntPtr.Zero);return;
      }
      var bounds=LiveMiniTracker.FarmerBounds(frame,scale,crop);
      if(!Screen.PrimaryScreen.Bounds.IntersectsWith(bounds)) { Status="Farmer is beyond the right display edge";Hide();NativeDock.SetProp(Handle,NativeDock.LiveProperty,IntPtr.Zero);return; }
      Status="Following BSOD's live position";
      bool shown=true;
      if(!Visible||Bounds!=bounds) {
        if(ClientSize!=bounds.Size)ClientSize=bounds.Size;
        if(!Visible) { Location=bounds.Location;Show(); }
        // Only the helper's own HWND is moved, without activating it.
        shown=NativeDock.SetWindowPos(Handle,new IntPtr(-1),bounds.X,bounds.Y,bounds.Width,bounds.Height,0x0010|0x0040);
      }
      NativeDock.SetProp(Handle,NativeDock.LiveProperty,shown?new IntPtr(1):IntPtr.Zero);
      // Aggregate timing only: no coordinates or settings are exposed.
      var latency=(long)((Stopwatch.GetTimestamp()-queryStarted)*1000000.0/Stopwatch.Frequency);
      NativeDock.SetProp(Handle,NativeDock.LatencyProperty,new IntPtr(Math.Min(int.MaxValue,Math.Max(0,latency))));
      if(!shown)Status="Own window could not be shown";
    }
    protected override void OnPaint(PaintEventArgs e) {
      base.OnPaint(e);
      e.Graphics.InterpolationMode=InterpolationMode.NearestNeighbor;
      e.Graphics.PixelOffsetMode=PixelOffsetMode.Half;
      var phase=animation.ElapsedMilliseconds%6600;
      var drawing=phase>=2340&&phase<3840?blink:idle;
      if(testMode) {
        e.Graphics.DrawString("Farmer visibility test\nThis test does not read mini state.\nClose this window when finished.",Font,Brushes.White,new PointF(14,12));
        int height=(int)Math.Round(VisibleHeight);
        e.Graphics.DrawImage(drawing,new Rectangle(140,92,(int)Math.Round(crop.Width*(double)height/crop.Height),height),crop,GraphicsUnit.Pixel);
      } else e.Graphics.DrawImage(drawing,ClientRectangle,crop,GraphicsUnit.Pixel);
    }
  }
  internal sealed class SavedMiniSettings {
    readonly string path;
    readonly JavaScriptSerializer json=new JavaScriptSerializer { MaxJsonLength=67108864 };
    DateTime stamp=DateTime.MinValue,lastGood=DateTime.MinValue;
    Rectangle lastScreen;
    internal bool Enabled;
    internal RectangleF Anchor;
    internal double Scale;
    internal string Status="Waiting for BSOD";
    internal SavedMiniSettings(string file) { path=file; }
    static double Number(Dictionary<string,object> value,string key,double fallback) {
      object result;double number;
      return value.TryGetValue(key,out result)&&result!=null&&double.TryParse(Convert.ToString(result,CultureInfo.InvariantCulture),NumberStyles.Float,CultureInfo.InvariantCulture,out number)&&!double.IsNaN(number)&&!double.IsInfinity(number)?number:fallback;
    }
    void Disable(string reason) { Enabled=false;stamp=DateTime.MinValue;Status=reason; }
    internal void Poll(Rectangle screen,bool supported) {
      try {
        if(!supported) { Disable("Multiple-monitor layout is not supported");return; }
        if(!NativeDock.DesktopRunning()) { Disable("Waiting for Codex desktop");return; }
        if(!File.Exists(path)) { Disable("Waiting for the mini position");return; }
        if(screen!=lastScreen) { stamp=DateTime.MinValue;lastScreen=screen; }
        var changed=File.GetLastWriteTimeUtc(path);
        if(changed==stamp&&Enabled) { lastGood=DateTime.UtcNow;return; }
        Dictionary<string,object> state;
        using(var stream=new FileStream(path,FileMode.Open,FileAccess.Read,FileShare.ReadWrite|FileShare.Delete))
        using(var reader=new StreamReader(stream))state=json.Deserialize<Dictionary<string,object>>(reader.ReadToEnd());
        if(state==null)throw new InvalidDataException();
        object open,raw;
        if(!state.TryGetValue("electron-avatar-overlay-open",out open)||!Equals(open,true)||!state.TryGetValue("electron-avatar-overlay-bounds",out raw)) { Disable("Mini is hidden");return; }
        var anchor=raw as Dictionary<string,object>;object displayRaw;
        var display=anchor!=null&&anchor.TryGetValue("displayBounds",out displayRaw)?displayRaw as Dictionary<string,object>:null;
        if(display==null)throw new InvalidDataException();
        double dx=Number(display,"x",0),dy=Number(display,"y",0),dw=Number(display,"width",0),dh=Number(display,"height",0);
        double ax=Number(anchor,"x",double.NaN),ay=Number(anchor,"y",double.NaN);
        if(dw<=0||dh<=0||double.IsNaN(ax)||double.IsNaN(ay))throw new InvalidDataException();
        double sx=screen.Width/dw,sy=screen.Height/dh;
        if(Math.Abs(sx-sy)>.02*Math.Max(sx,sy)) { Disable("Saved monitor geometry does not match");return; }
        Anchor=new RectangleF((float)(screen.Left+(ax-dx)*sx),(float)(screen.Top+(ay-dy)*sy),(float)(80*sx),(float)(208.0*80/192*sy));
        Scale=sy;Enabled=true;stamp=changed;lastGood=DateTime.UtcNow;Status="Waiting for the visible BSOD pet";
      }catch(IOException) { Incomplete(); }
       catch(UnauthorizedAccessException) { Incomplete(); }
       catch(ArgumentException) { Incomplete(); }
       catch(InvalidOperationException) { Incomplete(); }
       catch(FormatException) { Incomplete(); }
       catch(OverflowException) { Incomplete(); }
    }
    void Incomplete() { Status="Waiting for a complete settings update";if((DateTime.UtcNow-lastGood).TotalSeconds>2)Disable(Status); }
  }
  internal sealed class LiveMiniTracker : IDisposable {
    readonly object gate=new object();
    readonly System.Threading.Thread worker;
    readonly SavedMiniSettings settings;
    readonly bool allowed;
    bool enabled,stopped,screenReady,screenSupported;
    Rectangle screen;
    RectangleF latest;
    double scale;
    long queryStarted;
    string status="Waiting for BSOD";
    DateTime sampled=DateTime.MinValue;
    internal event Action SampleChanged;
    internal string Status { get { lock(gate)return status; } }
    internal LiveMiniTracker(string stateFile,bool active) {
      settings=new SavedMiniSettings(stateFile);allowed=active;
      worker=new System.Threading.Thread(ReadLoop) { IsBackground=true,Name="Farmer BSOD geometry reader" };
      worker.SetApartmentState(System.Threading.ApartmentState.MTA);worker.Start();
    }
    internal void ConfigureScreen(Rectangle bounds,bool supported) {
      lock(gate) { screen=bounds;screenReady=true;screenSupported=supported;if(!supported) { enabled=false;sampled=DateTime.MinValue; } }
    }
    internal bool TryGet(out RectangleF frame,out double displayScale,out long started) {
      lock(gate) { frame=latest;displayScale=scale;started=queryStarted;return enabled&&(DateTime.UtcNow-sampled).TotalMilliseconds<300; }
    }
    internal static Rectangle FarmerBounds(RectangleF frame,double scale,Rectangle crop) {
      int height=Math.Max(1,(int)Math.Round(FarmerDock.VisibleHeight*scale));
      int width=Math.Max(1,(int)Math.Round(crop.Width*(double)height/crop.Height));
      return new Rectangle((int)Math.Round(frame.Left+frame.Width*154/192.0+4*scale),(int)Math.Round(frame.Top+frame.Height*198/208.0)-height,width,height);
    }
    internal static bool ReadImage(IntPtr window,int owner,bool native,out RectangleF frame) {
      frame=RectangleF.Empty;
      var root=AutomationElement.FromHandle(window);
      if(root==null)return false;
      // Search only this verified mini window and only the exact known pet name.
      // No other element names, conversation contents, or actions are requested.
      var images=root.FindAll(TreeScope.Descendants,new PropertyCondition(AutomationElement.NameProperty,"BSOD pet"));
      if(images.Count!=1)return false;
      var item=images[0].Current;
      if(item.ProcessId!=owner||item.ControlType!=ControlType.Image||item.IsOffscreen)return false;
      if(native&&!item.ClassName.StartsWith("codex-avatar-button",StringComparison.Ordinal))return false;
      var bounds=item.BoundingRectangle;
      if(bounds.IsEmpty||bounds.Width<=0||bounds.Height<=0||double.IsNaN(bounds.Left)||double.IsNaN(bounds.Top)||double.IsInfinity(bounds.Left)||double.IsInfinity(bounds.Top))return false;
      if(Math.Abs(bounds.Width/bounds.Height-192.0/208)>.08)return false;
      frame=new RectangleF((float)bounds.Left,(float)bounds.Top,(float)bounds.Width,(float)bounds.Height);return true;
    }
    internal static bool ConvertBounds(System.Windows.Rect bounds,out RectangleF frame) {
      frame=RectangleF.Empty;
      if(bounds.IsEmpty||bounds.Width<=0||bounds.Height<=0)return false;
      foreach(double value in new [] {bounds.Left,bounds.Top,bounds.Width,bounds.Height})if(double.IsNaN(value)||double.IsInfinity(value))return false;
      if(Math.Abs(bounds.Width/bounds.Height-192.0/208)>.08)return false;
      frame=new RectangleF((float)bounds.Left,(float)bounds.Top,(float)bounds.Width,(float)bounds.Height);return true;
    }
    internal static AutomationElement ResolveImage(IntPtr window,int owner,bool native) {
      var root=AutomationElement.FromHandle(window);if(root==null)return null;
      var request=new CacheRequest { TreeScope=TreeScope.Element,AutomationElementMode=AutomationElementMode.Full };
      foreach(var property in new [] {AutomationElement.NameProperty,AutomationElement.ProcessIdProperty,AutomationElement.ControlTypeProperty,AutomationElement.ClassNameProperty,AutomationElement.IsOffscreenProperty})request.Add(property);
      using(request.Activate()) {
        var images=root.FindAll(TreeScope.Descendants,new PropertyCondition(AutomationElement.NameProperty,"BSOD pet"));
        if(images.Count!=1)return null;
        var image=images[0];var item=image.Cached;
        if(item.Name!="BSOD pet"||item.ProcessId!=owner||item.ControlType!=ControlType.Image||item.IsOffscreen)return null;
        if(native&&!item.ClassName.StartsWith("codex-avatar-button",StringComparison.Ordinal))return null;
        return image;
      }
    }
    internal static bool ReadCachedImage(AutomationElement image,out RectangleF frame) {
      frame=RectangleF.Empty;
      var value=image.GetCurrentPropertyValue(AutomationElement.BoundingRectangleProperty,true);
      return value is System.Windows.Rect && ConvertBounds((System.Windows.Rect)value,out frame);
    }
    void InvalidateSample() {
      bool notify;
      lock(gate) { notify=sampled!=DateTime.MinValue;sampled=DateTime.MinValue; }
      if(notify) { var callback=SampleChanged;if(callback!=null)callback(); }
    }
    void ReadLoop() {
      IntPtr window=IntPtr.Zero;int owner=0;AutomationElement image=null;
      var cadence=Stopwatch.StartNew();long nextSettings=0,nextValidation=0;
      while(true) {
        bool ready,supported;Rectangle display;
        lock(gate) { if(stopped)return;ready=allowed&&screenReady;supported=screenSupported;display=screen; }
        var iteration=Stopwatch.StartNew();
        if(ready) {
          try {
            if(cadence.ElapsedMilliseconds>=nextSettings) {
              settings.Poll(display,supported);nextSettings=cadence.ElapsedMilliseconds+250;
              lock(gate) { enabled=settings.Enabled&&screenSupported;scale=settings.Scale;status=settings.Status; }
            }
            if(!settings.Enabled||!supported) { image=null;window=IntPtr.Zero;InvalidateSample(); }
            else {
              if(image==null||cadence.ElapsedMilliseconds>=nextValidation) {
                if(window==IntPtr.Zero||!NativeDock.IsMini(window,out owner))window=NativeDock.FindMini(settings.Anchor,out owner);
                image=window==IntPtr.Zero?null:ResolveImage(window,owner,true);
                nextValidation=cadence.ElapsedMilliseconds+250;
              }
              RectangleF frame;long began=Stopwatch.GetTimestamp();
              if(image!=null&&ReadCachedImage(image,out frame)) {
                bool notify;
                lock(gate) {
                  notify=sampled==DateTime.MinValue||latest!=frame;
                  if(enabled&&!stopped) { latest=frame;sampled=DateTime.UtcNow;queryStarted=began; }
                  else notify=false;
                }
                // Coalesce on the Form. No second polling timer is needed for movement.
                if(notify) { var callback=SampleChanged;if(callback!=null)callback(); }
              } else { image=null;InvalidateSample(); }
            }
          } catch(ElementNotAvailableException) { image=null;window=IntPtr.Zero;InvalidateSample(); }
            catch(COMException) { image=null;window=IntPtr.Zero;InvalidateSample(); }
            catch(InvalidOperationException) { image=null;window=IntPtr.Zero;InvalidateSample(); }
            catch(ArgumentException) { image=null;window=IntPtr.Zero;InvalidateSample(); }
        }
        System.Threading.Thread.Sleep(ready?Math.Max(1,10-(int)iteration.ElapsedMilliseconds):50);
      }
    }
    public void Dispose() { lock(gate) { stopped=true;enabled=false;sampled=DateTime.MinValue; } }
  }
  internal static class NativeDock {
    internal delegate bool EnumWindowProc(IntPtr window,IntPtr parameter);
    [StructLayout(LayoutKind.Sequential)] internal struct Rect { public int Left,Top,Right,Bottom; }
    [DllImport("user32.dll")] static extern bool EnumWindows(EnumWindowProc callback,IntPtr parameter);
    [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr window,out uint id);
    [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern int GetWindowText(IntPtr window,StringBuilder title,int max);
    [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr window);
    [DllImport("user32.dll")] static extern bool GetWindowRect(IntPtr window,out Rect rect);
    [DllImport("user32.dll")] static extern int GetWindowLong(IntPtr window,int index);
    [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern int GetClassName(IntPtr window,StringBuilder name,int max);
    [DllImport("user32.dll",CharSet=CharSet.Unicode)] internal static extern bool SetProp(IntPtr window,string name,IntPtr value);
    [DllImport("user32.dll",CharSet=CharSet.Unicode)] static extern IntPtr GetProp(IntPtr window,string name);
    [DllImport("user32.dll",SetLastError=true)] internal static extern bool SetWindowPos(IntPtr window,IntPtr after,int x,int y,int width,int height,uint flags);
    internal const string LiveProperty="AstraFarmerDock.LiveTracking";
    internal const string LatencyProperty="AstraFarmerDock.QueryToPlacementMicroseconds";
    static DateTime presenceChecked=DateTime.MinValue;
    static readonly object presenceGate=new object();
    static HashSet<int> desktopIds=new HashSet<int>();
    internal static bool DesktopRunning() {
      return DesktopIds().Count>0;
    }
    static HashSet<int> DesktopIds() {
      lock(presenceGate) {
      if((DateTime.UtcNow-presenceChecked).TotalMilliseconds<500)return new HashSet<int>(desktopIds);
      presenceChecked=DateTime.UtcNow;desktopIds.Clear();
      // Codex desktop is ChatGPT.exe in the OpenAI.Codex package. Its separate
      // codex.exe CLI must not keep this companion alive visually.
      foreach(var name in new [] {"ChatGPT","Codex"}) {
        foreach(var process in Process.GetProcessesByName(name))using(process) {
          try {
            var path=process.MainModule.FileName;
            if(path.IndexOf("\\WindowsApps\\OpenAI.Codex_",StringComparison.OrdinalIgnoreCase)>=0 && File.Exists(Path.Combine(Path.GetDirectoryName(path),"resources","app.asar")))desktopIds.Add(process.Id);
          } catch(System.ComponentModel.Win32Exception) { }
            catch(InvalidOperationException) { }
        }
      }
      return new HashSet<int>(desktopIds);
      }
    }
    internal static bool IsMini(IntPtr window,out int owner) {
      uint id;GetWindowThreadProcessId(window,out id);owner=(int)id;
      if(!DesktopIds().Contains(owner)||!IsWindowVisible(window))return false;
      int style=GetWindowLong(window,-16),extra=GetWindowLong(window,-20);
      const int required=0x80|0x8|0x80000;
      if((extra&required)!=required||(style&0x00C00000)!=0)return false;
      var name=new StringBuilder(128);GetClassName(window,name,name.Capacity);
      return name.ToString()=="Chrome_WidgetWin_1";
    }
    internal static IntPtr FindMini(RectangleF saved,out int owner) {
      IntPtr match=IntPtr.Zero;int count=0,matchedOwner=0;
      EnumWindows(delegate(IntPtr window,IntPtr unused) {
        int process;if(!IsMini(window,out process))return true;
        Rect bounds;if(!GetWindowRect(window,out bounds))return true;
        if(!saved.IsEmpty&&!RectangleF.FromLTRB(bounds.Left,bounds.Top,bounds.Right,bounds.Bottom).Contains(saved.Left+saved.Width/2,saved.Top+saved.Height/2))return true;
        match=window;matchedOwner=process;count++;return true;
      },IntPtr.Zero);
      owner=matchedOwner;return count==1?match:IntPtr.Zero;
    }
    internal static List<int> Instances(string root) {
      var ids=new List<int>();int own=Process.GetCurrentProcess().Id;
      var expected=Path.GetFullPath(Path.Combine(root,"bin","farmer-dock-20261008.exe"));
      foreach(var process in Process.GetProcessesByName("farmer-dock-20261008"))using(process) {
        try { if(process.Id!=own && string.Equals(process.MainModule.FileName,expected,StringComparison.OrdinalIgnoreCase))ids.Add(process.Id); }
        catch(System.ComponentModel.Win32Exception) { }
        catch(InvalidOperationException) { }
      }
      return ids;
    }
    internal static void Check(string root) {
      var ids=Instances(root);int windows=0,visible=0,onScreen=0,noActivate=0,topmost=0,live=0;long latency=0;
      EnumWindows(delegate(IntPtr window,IntPtr unused) {
        uint id;GetWindowThreadProcessId(window,out id);if(!ids.Contains((int)id))return true;
        var title=new StringBuilder(256);GetWindowText(window,title,title.Capacity);if(title.ToString()!=FarmerDock.WindowTitle)return true;
        windows++;if(IsWindowVisible(window))visible++;
        Rect rect;if(GetWindowRect(window,out rect)&&SystemInformation.VirtualScreen.IntersectsWith(Rectangle.FromLTRB(rect.Left,rect.Top,rect.Right,rect.Bottom)))onScreen++;
        int style=GetWindowLong(window,-20);if((style&0x08000000)!=0)noActivate++;if((style&8)!=0)topmost++;
        if(GetProp(window,LiveProperty)==new IntPtr(1))live++;
        latency=Math.Max(latency,GetProp(window,LatencyProperty).ToInt64());
        return true;
      },IntPtr.Zero);
      // Print health only. Saved settings and coordinates are never logged.
      Console.WriteLine("desktop_running="+DesktopRunning()+"; companion_processes="+ids.Count+"; companion_windows="+windows+"; visible_windows="+visible+"; on_screen_windows="+onScreen+"; nonactivating_windows="+noActivate+"; topmost_windows="+topmost+"; live_tracking_windows="+live+"; latest_query_to_placement_ms="+(latency/1000.0).ToString("F2",CultureInfo.InvariantCulture));
    }
    internal static void SelfTest(string root) {
      string path=Path.Combine(root,"art","frames","farmer","idle-20261008.png");
      using(var bitmap=FarmerDock.DetachedBitmap(path)) {
        // Opening exclusively while the sprite is alive proves there is no PNG lock.
        using(var stream=new FileStream(path,FileMode.Open,FileAccess.Read,FileShare.None)) { }
        var bounds=FarmerDock.AlphaBounds(bitmap);
        if(bounds.Height<1||Math.Abs(FarmerDock.VisibleHeight-58.75)>0.0001)throw new InvalidOperationException("Sprite geometry test failed.");
      }
      Console.WriteLine("Passed: detached sprite permits exclusive file access; computer-head height is fixed at 58.75 logical pixels.");
    }
    internal static void Benchmark() {
      Exception failure=null;
      var worker=new System.Threading.Thread(delegate() {
        try {
          int owner;var window=FindMini(RectangleF.Empty,out owner);
          if(window==IntPtr.Zero)throw new InvalidOperationException("Exactly one native mini is required.");
          var legacy=new double[24];var cached=new double[80];RectangleF frame;
          for(int i=0;i<legacy.Length;i++) {
            var clock=Stopwatch.StartNew();
            if(!LiveMiniTracker.ReadImage(window,owner,true,out frame))throw new InvalidOperationException("Visible BSOD required.");
            legacy[i]=clock.Elapsed.TotalMilliseconds;
          }
          var image=LiveMiniTracker.ResolveImage(window,owner,true);
          if(image==null)throw new InvalidOperationException("BSOD validation failed.");
          for(int i=0;i<cached.Length;i++) {
            var clock=Stopwatch.StartNew();
            if(!LiveMiniTracker.ReadCachedImage(image,out frame))throw new InvalidOperationException("Cached geometry unavailable.");
            cached[i]=clock.Elapsed.TotalMilliseconds;
          }
          Array.Sort(legacy);Array.Sort(cached);
          Console.WriteLine(string.Format(CultureInfo.InvariantCulture,"Geometry query benchmark only (milliseconds): full search median={0:F2}, p95={1:F2}; cached rectangle median={2:F2}, p95={3:F2}. No window was moved.",legacy[legacy.Length/2],legacy[(int)(legacy.Length*.95)],cached[cached.Length/2],cached[(int)(cached.Length*.95)]));
        }catch(Exception error) { failure=error; }
      });
      worker.IsBackground=true;worker.SetApartmentState(System.Threading.ApartmentState.MTA);worker.Start();
      if(!worker.Join(15000)||failure!=null)throw new InvalidOperationException("Geometry benchmark unavailable.");
    }
    static bool ReadOwnImage(IntPtr window,out RectangleF frame) {
      RectangleF found=RectangleF.Empty;bool valid=false;Exception failure=null;
      int process=Process.GetCurrentProcess().Id;
      var thread=new System.Threading.Thread(delegate() {
        try { var image=LiveMiniTracker.ResolveImage(window,process,false);valid=image!=null&&LiveMiniTracker.ReadCachedImage(image,out found); } catch(Exception error) { failure=error; }
      });
      thread.IsBackground=true;thread.SetApartmentState(System.Threading.ApartmentState.MTA);thread.Start();
      var deadline=DateTime.UtcNow.AddSeconds(5);
      while(thread.IsAlive&&DateTime.UtcNow<deadline) { Application.DoEvents();System.Threading.Thread.Sleep(10); }
      if(thread.IsAlive||failure!=null)throw new InvalidOperationException("Synthetic UIA geometry reader failed.");
      frame=found;return valid;
    }
    static void CheckCachedMovement(Form window,PictureBox sprite,out RectangleF before,out RectangleF after) {
      RectangleF first=RectangleF.Empty,last=RectangleF.Empty;Exception failure=null;
      int process=Process.GetCurrentProcess().Id;IntPtr handle=window.Handle;
      using(var moved=new System.Threading.ManualResetEvent(false)) {
        var thread=new System.Threading.Thread(delegate() {
          try {
            var image=LiveMiniTracker.ResolveImage(handle,process,false);
            if(image==null||!LiveMiniTracker.ReadCachedImage(image,out first))throw new InvalidOperationException();
            window.BeginInvoke((Action)delegate { sprite.Location=new Point(sprite.Left+61,sprite.Top+37);moved.Set(); });
            if(!moved.WaitOne(2000)||!LiveMiniTracker.ReadCachedImage(image,out last))throw new InvalidOperationException();
          }catch(Exception error) { failure=error; }
        });
        thread.IsBackground=true;thread.SetApartmentState(System.Threading.ApartmentState.MTA);thread.Start();
        var deadline=DateTime.UtcNow.AddSeconds(5);
        while(thread.IsAlive&&DateTime.UtcNow<deadline) { Application.DoEvents();System.Threading.Thread.Sleep(1); }
        if(thread.IsAlive||failure!=null)throw new InvalidOperationException("Cached element movement test failed.");
      }
      before=first;after=last;
    }
    internal static void TrackingTest() {
      using(var window=new Form { Text="Farmer tracking test - synthetic pet only",StartPosition=FormStartPosition.Manual,Location=new Point(100,100),ClientSize=new Size(500,350) })
      using(var sprite=new PictureBox { AccessibleName="BSOD pet",AccessibleRole=AccessibleRole.Graphic,Location=new Point(50,60),Size=new Size(96,104),BackColor=Color.CornflowerBlue }) {
        window.Controls.Add(sprite);window.Show();Application.DoEvents();
        var originalWindow=window.Bounds;RectangleF before,after;
        CheckCachedMovement(window,sprite,out before,out after);
        if(window.Bounds!=originalWindow||Math.Abs(after.X-before.X-61)>1||Math.Abs(after.Y-before.Y-37)>1)throw new InvalidOperationException("Child movement tracking failed.");
        var crop=new Rectangle(38,32,180,192);
        var first=LiveMiniTracker.FarmerBounds(before,1,crop);var second=LiveMiniTracker.FarmerBounds(after,1,crop);
        if(second.X-first.X!=61||second.Y-first.Y!=37||first.Size!=second.Size||first.Left<=before.Left+before.Width*154/192.0)throw new InvalidOperationException("Right-side attachment failed.");
        using(var duplicate=new PictureBox { AccessibleName="BSOD pet",AccessibleRole=AccessibleRole.Graphic,Location=new Point(250,60),Size=new Size(96,104),BackColor=Color.Blue }) {
          window.Controls.Add(duplicate);Application.DoEvents();RectangleF ignored;
          if(ReadOwnImage(window.Handle,out ignored))throw new InvalidOperationException("Ambiguous image was accepted.");
        }
        sprite.Hide();Application.DoEvents();RectangleF hidden;
        if(ReadOwnImage(window.Handle,out hidden))throw new InvalidOperationException("Hidden image was accepted.");
        window.Close();
      }
      Console.WriteLine("Passed: cached Image follows child movement inside a stationary parent; right-side attachment; fixed size; duplicate and hidden images rejected. Only synthetic test windows were moved.");
    }
  }
}
public static class FarmerDockProgram {
  [STAThread]
  public static int Main(string[] args) {
    if(args.Length<1) { Console.Error.WriteLine("Pass the pet app directory.");return 1; }
    string root=Path.GetFullPath(args[0]),mode=args.Length>1?args[1]:"";
    try {
      if(mode=="--check") { AstraPetApps.NativeDock.Check(root);return 0; }
      if(mode=="--self-test") { AstraPetApps.NativeDock.SelfTest(root);return 0; }
      if(mode=="--benchmark") { AstraPetApps.NativeDock.Benchmark();return 0; }
      if(mode=="--tracking-test") { Application.EnableVisualStyles();AstraPetApps.NativeDock.TrackingTest();return 0; }
      if(mode=="--running")return AstraPetApps.NativeDock.Instances(root).Count>0?0:1;
      if(mode!=""&&mode!="--test")return 1;
      using(var mutex=new System.Threading.Mutex(false,"Local\\AstraPetApps-FarmerDock-20261008"+(mode=="--test"?"-test":""))) {
        bool acquired;try { acquired=mutex.WaitOne(0); }catch(System.Threading.AbandonedMutexException) { acquired=true; }
        if(!acquired)return 0;
        try {
          if(mode==""&&AstraPetApps.NativeDock.Instances(root).Count>0)return 0;
          Application.EnableVisualStyles();
          using(var context=new ApplicationContext())using(var form=new AstraPetApps.FarmerDock(root,mode=="--test")) {
            form.FormClosed+=(s,e)=>context.ExitThread();
            // A Form passed directly to Application.Run would be shown even
            // when the saved mini-open flag says it should stay hidden.
            Application.Run(context);
          }
        } finally { mutex.ReleaseMutex(); }
      }
      return 0;
    } catch(Exception) { Console.Error.WriteLine("Farmer Dock could not start. Check the dated sprites and build output.");return 1; }
  }
}
