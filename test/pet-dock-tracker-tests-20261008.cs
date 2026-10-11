using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Threading;
using System.Windows.Automation;
using System.Windows.Forms;
using AstraDesktopPets;

internal static class PetDockTrackerTests {
  static void Check(bool value,string message) { if(!value)throw new InvalidOperationException(message); }
  sealed class FakeSource : IPetDockSource {
    internal readonly object Gate=new object();
    internal readonly List<long> Calls=new List<long>(),Discoveries=new List<long>();
    internal readonly ManualResetEvent Done=new ManualResetEvent(false);
    readonly Stopwatch clock=Stopwatch.StartNew();
    internal bool Missing;
    public bool HasTarget { get { return !Missing; } }
    public Rectangle? Sample(bool revalidate) {
      lock(Gate) { Calls.Add(clock.ElapsedMilliseconds);if(revalidate)Discoveries.Add(clock.ElapsedMilliseconds); }
      return Missing?(Rectangle?)null:new Rectangle(100,100,96,104);
    }
    public void Dispose() { Done.Set(); }
  }
  static void WorkerCadence() {
    var source=new FakeSource();int callbacks=0;
    using(var first=new ManualResetEvent(false)) {
      var tracker=new PetDockTracker(delegate(Rectangle? bounds) { Interlocked.Increment(ref callbacks);first.Set(); },source);
      tracker.Start();tracker.Start();
      Check(first.WaitOne(2000),"Worker did not deliver its first result.");
      Thread.Sleep(2250);tracker.Dispose();
      Check(source.Done.WaitOne(2000),"Worker did not stop cleanly.");
      lock(source.Gate) {
        Check(source.Calls.Count>=2&&source.Calls.Count<=13,"Geometry calls exceed the five-per-second limit or duplicated workers.");
        for(int i=1;i<source.Calls.Count;i++)Check(source.Calls[i]-source.Calls[i-1]>=195,"Geometry worker polled too quickly.");
        Check(source.Discoveries.Count>=2,"Identity was not revalidated.");
        for(int i=1;i<source.Discoveries.Count;i++)Check(source.Discoveries[i]-source.Discoveries[i-1]>=1995,"Discovery ran more often than every two seconds.");
      }
      Check(callbacks==1,"Unchanged geometry should not queue repeat callbacks.");
      tracker.Dispose();source.Done.Dispose();
    }
    var missing=new FakeSource { Missing=true };int missingCallbacks=0;
    using(var first=new ManualResetEvent(false)) {
      var tracker=new PetDockTracker(delegate(Rectangle? bounds) { Check(!bounds.HasValue,"Missing target returned geometry.");Interlocked.Increment(ref missingCallbacks);first.Set(); },missing);
      tracker.Start();Check(first.WaitOne(2000),"Missing target result was not delivered.");
      Thread.Sleep(500);tracker.Dispose();Check(missing.Done.WaitOne(2000),"Missing worker failed to stop.");
      lock(missing.Gate)Check(missing.Calls.Count==1,"Missing target caused busy discovery polling.");
      Check(missingCallbacks==1,"Missing target flooded callbacks.");missing.Done.Dispose();
    }
  }
  sealed class SyntheticWindow : Form {
    protected override bool ShowWithoutActivation { get { return true; } }
  }
  static bool ReadOwnImage(IntPtr handle,int process,bool native,out Rectangle bounds,out bool ambiguous) {
    Rectangle result=Rectangle.Empty;bool valid=false,duplicate=false;Exception failure=null;
    var thread=new Thread(delegate() {
      try {
        var image=PetDockSource.ResolveImage(handle,process,native,out duplicate);
        if(image!=null) {
          var raw=image.GetCurrentPropertyValue(AutomationElement.BoundingRectangleProperty,true);
          valid=raw is System.Windows.Rect&&PetDockSource.ConvertBounds((System.Windows.Rect)raw,out result);
        }
      }catch(Exception error) { failure=error; }
    });
    thread.IsBackground=true;thread.SetApartmentState(ApartmentState.MTA);thread.Start();
    var wait=Stopwatch.StartNew();
    while(thread.IsAlive&&wait.ElapsedMilliseconds<5000) { Application.DoEvents();Thread.Sleep(10); }
    Check(!thread.IsAlive&&failure==null,"Synthetic UIA query failed.");bounds=result;ambiguous=duplicate;return valid;
  }
  static void SyntheticImages() {
    using(var window=new SyntheticWindow { Text="Desktop pets docking test - synthetic image only",StartPosition=FormStartPosition.Manual,Location=new Point(100,100),ClientSize=new Size(380,240) })
    using(var sprite=new PictureBox { AccessibleName="BSOD pet",AccessibleRole=AccessibleRole.Graphic,Location=new Point(25,30),Size=new Size(96,104),BackColor=Color.CornflowerBlue }) {
      window.Controls.Add(sprite);window.Show();Application.DoEvents();
      int owner=Process.GetCurrentProcess().Id;Rectangle bounds;bool ambiguous;
      Check(ReadOwnImage(window.Handle,owner,false,out bounds,out ambiguous)&&!ambiguous,"Unique visible Image was not accepted.");
      Check(bounds.Size==sprite.Size&&bounds.Location==sprite.PointToScreen(Point.Empty),"Image coordinates are not its physical screen rectangle.");
      Check(!ReadOwnImage(window.Handle,owner+1,false,out bounds,out ambiguous),"Wrong-process Image was accepted.");
      Check(!ReadOwnImage(window.Handle,owner,true,out bounds,out ambiguous),"Synthetic class was accepted as packaged Codex pet.");
      using(var second=new PictureBox { AccessibleName="BSOD pet",AccessibleRole=AccessibleRole.Graphic,Location=new Point(220,30),Size=new Size(96,104),BackColor=Color.Blue }) {
        window.Controls.Add(second);Application.DoEvents();
        Check(!ReadOwnImage(window.Handle,owner,false,out bounds,out ambiguous)&&ambiguous,"Duplicate pet Images were accepted.");
      }
      sprite.Hide();Application.DoEvents();
      Check(!ReadOwnImage(window.Handle,owner,false,out bounds,out ambiguous),"Hidden pet Image was accepted.");
      window.Close();
    }
  }
  [STAThread] public static int Main() {
    try {
      Rectangle result;
      Check(PetDockSource.ConvertBounds(new System.Windows.Rect(-900,100,96,104),out result)&&result==new Rectangle(-900,100,96,104),"Multi-monitor physical geometry was rejected.");
      Check(!PetDockSource.ConvertBounds(System.Windows.Rect.Empty,out result),"Empty bounds were accepted.");
      Check(!PetDockSource.ConvertBounds(new System.Windows.Rect(0,0,96,20),out result),"Wrong pet aspect ratio was accepted.");
      Check(!PetDockSource.ConvertBounds(new System.Windows.Rect(Double.PositiveInfinity,0,96,104),out result),"Non-finite bounds were accepted.");
      Check(PetDockNative.IsCodexPackagePath(@"C:\Program Files\WindowsApps\OpenAI.Codex_1.0_x64__example\app\ChatGPT.exe"),"Expected packaged desktop path rejected.");
      Check(!PetDockNative.IsCodexPackagePath(@"C:\Users\example\AppData\Local\OpenAI\Codex\bin\codex.exe"),"CLI path counted as desktop.");
      Check(!PetDockNative.IsCodexPackagePath(@"C:\Program Files\WindowsApps\OtherApp_1.0\ChatGPT.exe"),"Unrelated package accepted.");
      WorkerCadence();Application.EnableVisualStyles();SyntheticImages();
      Console.WriteLine("Passed: bounded worker cadence, two-second discovery, idle backoff, duplicate Start and callbacks, disposal, scoped synthetic Image geometry, duplicates/hidden/wrong process/class rejection, and packaged-path filtering. No Codex window was queried or changed.");return 0;
    }catch(Exception error) { Console.Error.WriteLine(error);return 1; }
  }
}
