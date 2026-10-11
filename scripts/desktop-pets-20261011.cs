// Astra's desktop pets. OpenAI Codex (GPT-6), 2026-10-08; free-roaming redesign by Claude Opus 5.5, 2026-10-09.
// The star shows or hides every pet at once. Each pet roams the screen in its own compact
// window. No hooks, global input polling, or desktop-sized windows.
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows.Forms;
using Microsoft.Win32;

namespace AstraDesktopPets {
  internal static class PetFiles {
    internal const string RunName = "findastra-desktop-pets";
    internal const string Identity = "Local\\FindastraDesktopPets20261008";
    internal const string SettingsKey = "Software\\Findastra\\DesktopPets";
    internal static readonly JavaScriptSerializer Json = new JavaScriptSerializer { MaxJsonLength = 4194304 };
    internal static string Root;
    internal static string StateFile { get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "astras-pet-apps", "desktop-pets-status-20261008.json"); } }
    internal static string TestStateFile { get { return Path.Combine(Path.GetDirectoryName(StateFile),"desktop-pets-test-status-20261008.json"); } }
    internal static string Exe { get { return Path.Combine(Root,"bin","desktop-pets-20261008.exe"); } }
    internal static string StartupCommand { get { return "\"" + Exe + "\" \"" + Root + "\" --startup"; } }
    internal static string BugExe { get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),"ChatGPT","Voicemeeter Bug","voicemeeter-bug-20261008.exe"); } }
    internal static Dictionary<string,object> Read(string relative) { return Json.Deserialize<Dictionary<string,object>>(File.ReadAllText(SafePath(relative))); }
    internal static string SafePath(string relative) {
      if(String.IsNullOrWhiteSpace(relative)||Path.IsPathRooted(relative))throw new InvalidDataException("Expected a relative pet asset path.");
      string full=Path.GetFullPath(Path.Combine(Root,relative.Replace('/',Path.DirectorySeparatorChar)));
      if(!full.StartsWith(Root+Path.DirectorySeparatorChar,StringComparison.OrdinalIgnoreCase))throw new InvalidDataException("Pet asset is outside its app folder.");
      return full;
    }
    internal static string Text(Dictionary<string,object> obj,string key,string fallback="") { object value; return obj.TryGetValue(key,out value)&&value!=null?Convert.ToString(value,CultureInfo.InvariantCulture):fallback; }
    internal static bool StartupEnabled() { using(var key=Registry.CurrentUser.OpenSubKey("Software\\Microsoft\\Windows\\CurrentVersion\\Run"))return key!=null&&String.Equals(Convert.ToString(key.GetValue(RunName)),StartupCommand,StringComparison.Ordinal); }
    internal static void Startup(bool enabled) { using(var key=Registry.CurrentUser.CreateSubKey("Software\\Microsoft\\Windows\\CurrentVersion\\Run")) { if(enabled)key.SetValue(RunName,StartupCommand,RegistryValueKind.String);else if(String.Equals(Convert.ToString(key.GetValue(RunName)),StartupCommand,StringComparison.Ordinal))key.DeleteValue(RunName,false); } }
    internal static bool PetsOutSetting() { using(var key=Registry.CurrentUser.OpenSubKey(SettingsKey)) { object value=key==null?null:key.GetValue("PetsOut");return !(value is int)||(int)value!=0; } }
    internal static bool Signal(string action,string suffix="") { try { using(var handle=EventWaitHandle.OpenExisting(Identity+suffix+"-"+action))handle.Set();return true; } catch(WaitHandleCannotBeOpenedException) { return false; } }
    internal static void WriteStatus(object value,bool test=false) { Directory.CreateDirectory(Path.GetDirectoryName(StateFile));File.WriteAllText(test?TestStateFile:StateFile,Json.Serialize(value)); }
    internal static void Open(string relative) { string file=SafePath(relative);if(File.Exists(file))Process.Start(new ProcessStartInfo(file) { UseShellExecute=true }); }
    internal static void StartBug(string argument) { if(!File.Exists(BugExe))return;Process.Start(new ProcessStartInfo(BugExe,argument) { UseShellExecute=false,WindowStyle=argument=="--status"?ProcessWindowStyle.Normal:ProcessWindowStyle.Hidden,WorkingDirectory=Path.GetDirectoryName(BugExe) }); }
  }

  internal sealed class PetSprite : IDisposable {
    internal string Id,Name,Role,Interface,Kind;
    internal Bitmap Idle,Blink;
    internal bool DesktopArt;
    Bitmap idleInk,blinkInk;
    internal Rectangle Crop;
    internal RectangleF Hit;
    internal static PetSprite Load(Dictionary<string,object> entry,Dictionary<string,object> framesIndex) {
      var pet=new PetSprite { Id=PetFiles.Text(entry,"art"),Name=PetFiles.Text(entry,"pet"),Role=PetFiles.Text(entry,"role"),Interface=PetFiles.Text(entry,"interface_url"),Kind=PetFiles.Text(entry,"kind") };
      object raw;if(!framesIndex.TryGetValue(pet.Id,out raw))throw new InvalidDataException("No frames for "+pet.Name);
      var paths=(Dictionary<string,object>)((Dictionary<string,object>)raw)["frames"];
      string idle=PetFiles.SafePath(PetFiles.Text(paths,"idle")),blink=PetFiles.SafePath(PetFiles.Text(paths,"blink"));
      // Desktop-only drafts: the shared registry and website art keep their own assets.
      if(pet.Id=="health-hummy"||pet.Id=="farmer"||pet.Id=="discord-damsel"||pet.Id=="drum-dog"||pet.Id=="mommys-mommies") {
        string localIdle=PetFiles.SafePath("desktop-art/"+pet.Id+"/idle-20261011.png"),localBlink=PetFiles.SafePath("desktop-art/"+pet.Id+"/blink-20261011.png");
        if(File.Exists(localIdle)!=File.Exists(localBlink))throw new InvalidDataException("Incomplete desktop artwork for "+pet.Name);
        if(File.Exists(localIdle)){idle=localIdle;blink=localBlink;pet.DesktopArt=true;}
      }
      pet.Idle=Detached(idle);pet.Blink=Detached(blink);
      if(pet.DesktopArt) { CrispTransparency(pet.Idle);CrispTransparency(pet.Blink); }
      if(pet.Id=="portfolio-puffer") { PinkBelly(pet.Idle);PinkBelly(pet.Blink); }
      pet.idleInk=BlackMask(pet.Idle);pet.blinkInk=BlackMask(pet.Blink);
      pet.Crop=Rectangle.Union(AlphaBounds(pet.Idle),AlphaBounds(pet.Blink));
      return pet;
    }
    internal static PetSprite LoadDraft(Dictionary<string,object> entry) {
      var pet=new PetSprite { Id=PetFiles.Text(entry,"id"),Name=PetFiles.Text(entry,"name")+" (draft)",Role="pet",Interface=PetFiles.Text(entry,"interface"),DesktopArt=true };
      pet.Idle=Detached(PetFiles.Text(entry,"idle"));pet.Blink=Detached(PetFiles.Text(entry,"blink"));
      CrispTransparency(pet.Idle);CrispTransparency(pet.Blink);
      pet.idleInk=BlackMask(pet.Idle);pet.blinkInk=BlackMask(pet.Blink);
      pet.Crop=Rectangle.Union(AlphaBounds(pet.Idle),AlphaBounds(pet.Blink));return pet;
    }
    // WinForms color-key transparency cannot display partial alpha: it blends with
    // the magenta window background and leaves pink flecks around generated sprites.
    static void CrispTransparency(Bitmap source) {
      for(int y=0;y<source.Height;y++)for(int x=0;x<source.Width;x++) {
        Color c=source.GetPixel(x,y);
        if(c.A<128)source.SetPixel(x,y,Color.Transparent);
        else if(c.A<255)source.SetPixel(x,y,Color.FromArgb(255,c.R,c.G,c.B));
      }
    }
    // Desktop palette swap: only the cyan belly, preserving its pixel geometry and alpha.
    static void PinkBelly(Bitmap source) {
      for(int y=0;y<source.Height;y++)for(int x=0;x<source.Width;x++) {
        Color c=source.GetPixel(x,y);
        if(c.A>0&&c.G>c.R+50&&c.B>c.R+50) {
          float light=Math.Max(c.G,c.B)/255f;
          source.SetPixel(x,y,Color.FromArgb(c.A,(int)(255*light),(int)(190*light),(int)(215*light)));
        }
      }
    }
    static Bitmap BlackMask(Bitmap source) {
      var result=new Bitmap(source.Width,source.Height,PixelFormat.Format32bppArgb);
      for(int y=0;y<source.Height;y++)for(int x=0;x<source.Width;x++) { int alpha=source.GetPixel(x,y).A;if(alpha>0)result.SetPixel(x,y,Color.FromArgb(alpha,0,0,0)); }
      return result;
    }
    internal void Draw(Graphics g,bool blink,RectangleF bounds) {
      var mask=blink?blinkInk:idleInk;
      // One logical pixel, independent of source resolution or the pet's proportions.
      for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++)if(x!=0||y!=0) {
        var edge=bounds;edge.Offset(x,y);g.DrawImage(mask,edge,Crop,GraphicsUnit.Pixel);
      }
      g.DrawImage(blink?Blink:Idle,bounds,Crop,GraphicsUnit.Pixel);
    }
    internal static Bitmap Detached(string path) { using(var original=new Bitmap(path))return new Bitmap(original); }
    internal static Rectangle AlphaBounds(Bitmap bitmap) {
      int x0=bitmap.Width,y0=bitmap.Height,x1=-1,y1=-1;
      for(int y=0;y<bitmap.Height;y++)for(int x=0;x<bitmap.Width;x++)if(bitmap.GetPixel(x,y).A>0) { x0=Math.Min(x0,x);y0=Math.Min(y0,y);x1=Math.Max(x1,x);y1=Math.Max(y1,y); }
      if(x1<x0)throw new InvalidDataException("A pet frame is empty.");return Rectangle.FromLTRB(x0,y0,x1+1,y1+1);
    }
    public void Dispose() { if(Idle!=null)Idle.Dispose();if(Blink!=null)Blink.Dispose();if(idleInk!=null)idleInk.Dispose();if(blinkInk!=null)blinkInk.Dispose(); }
  }

  // Uses mouse-down times and Windows' configured interval/rectangle. Nothing is
  // dispatched while another eligible click is held, or before a drag is ruled out.
  internal sealed class PetClicks {
    readonly Action<string,int> action;
    readonly int interval;
    readonly Size distance;
    string target,pressed;
    int count;
    Point anchor;
    long due,down;
    bool held;
    internal PetClicks(Action<string,int> callback,int milliseconds,Size rectangle) { action=callback;interval=milliseconds;distance=rectangle; }
    internal bool Pending { get { return held||count>0; } }
    internal bool PendingFor(string id) { return id==target||id==pressed; }
    internal void Press(string id,Point point,long now) {
      // Switching actors cancels the pending gesture, so a click on one pet can never
      // resolve as a double-click on another.
      if(count>0&&id!=target)Cancel();
      else if(count>0&&(now>due||Math.Abs(point.X-anchor.X)>distance.Width/2||Math.Abs(point.Y-anchor.Y)>distance.Height/2))Complete();
      pressed=id;held=true;down=now;if(count==0)anchor=point;
    }
    internal void Release(string id,long now,bool dragged) {
      if(!held)return;held=false;
      if(dragged||String.IsNullOrEmpty(id)||id!=pressed){Cancel();return;}
      target=id;pressed=null;count++;due=down+interval;
      if(count>=2)Complete();else Advance(now);
    }
    internal void Advance(long now) { if(!held&&count>0&&now>due)Complete(); }
    internal void Cancel() { target=pressed=null;count=0;held=false; }
    void Complete() { string id=target;int number=count;Cancel();if(number>0)action(id,number); }
  }

  // How one pet wanders: a heading for a few seconds, now and then a short rest, and a
  // bounce at the edges of the working area. Separate from the window so the self-test
  // can run thousands of steps without showing anything.
  internal sealed class Roamer {
    readonly Random random;
    int dx,dy,heading,rest;
    internal Roamer(Random source) { random=source; }
    internal Point Next(Point at,Size size,Rectangle area,int step) {
      if(rest>0){rest--;return PetsWindow.Clamp(at,size,area);}
      if(heading<=0) {
        heading=random.Next(15,41);
        if(random.Next(6)==0)rest=random.Next(5,16);
        do{dx=random.Next(-2,3);dy=random.Next(-1,2);}while(dx==0&&dy==0);
      }
      heading--;
      var next=new Point(at.X+dx*step,at.Y+dy*step);
      if(next.X<area.Left||next.X+size.Width>area.Right){dx=-dx;next.X=at.X+dx*step;}
      if(next.Y<area.Top||next.Y+size.Height>area.Bottom){dy=-dy;next.Y=at.Y+dy*step;}
      return PetsWindow.Clamp(next,size,area);
    }
  }

  // One small input surface per pet. Transparent pixels pass through; there is never a
  // desktop-sized interception window.
  internal sealed class PetWindow : Form {
    readonly PetsWindow host;
    internal readonly PetSprite Pet;
    readonly Roamer roamer;
    readonly float scale;

    internal bool HasSparkles { get { return false; } }
    const int padding=4;
    internal RectangleF Body { get { return new RectangleF(padding,padding,Pet.Hit.Width,Pet.Hit.Height); } }
    internal int SparkleCount { get { return 0; } }

    bool dragging,dragged,hover,blink;
    Point dragMouse,dragWindow;
    internal PetWindow(PetsWindow owner,PetSprite pet,float dpi,Random random) {
      host=owner;Pet=pet;scale=dpi;roamer=new Roamer(random);
      FormBorderStyle=FormBorderStyle.None;ShowInTaskbar=false;TopMost=true;AutoScaleMode=AutoScaleMode.None;BackColor=Color.Magenta;TransparencyKey=Color.Magenta;StartPosition=FormStartPosition.Manual;Text=pet.Name+" - desktop pet";
      SetStyle(ControlStyles.AllPaintingInWmPaint|ControlStyles.OptimizedDoubleBuffer|ControlStyles.UserPaint,true);
      ClientSize=new Size((int)Math.Ceiling((pet.Hit.Width+padding*2)*scale),(int)Math.Ceiling((pet.Hit.Height+padding*2)*scale));
      MouseEnter+=delegate { hover=true;Cursor=Cursors.Hand; };MouseLeave+=delegate { hover=false; };
      MouseDown+=delegate(object s,MouseEventArgs e) { if(e.Button!=MouseButtons.Left)return;dragging=true;dragged=false;dragMouse=Cursor.Position;dragWindow=Location;Capture=true;host.PetPress(Pet.Id,Cursor.Position); };
      MouseMove+=delegate { if(!dragging)return;Point delta=new Point(Cursor.Position.X-dragMouse.X,Cursor.Position.Y-dragMouse.Y);if(PetsWindow.IsDrag(delta)){dragged=true;host.CancelClicks();}if(dragged)Location=PetsWindow.Clamp(new Point(dragWindow.X+delta.X,dragWindow.Y+delta.Y),Size,Screen.FromPoint(Cursor.Position).WorkingArea); };
      MouseUp+=delegate(object s,MouseEventArgs e) { if(e.Button!=MouseButtons.Left||!dragging)return;dragging=false;Capture=false;host.PetRelease(ClientRectangle.Contains(e.Location)?Pet.Id:null,dragged); };
      var menu=new ContextMenuStrip();menu.Opening+=delegate{host.CancelClicks();};menu.Items.Add("Open "+pet.Name,null,delegate{host.OpenPet(Pet);});menu.Items.Add("Hide the pets",null,delegate{host.SetPetsOut(false);});ContextMenuStrip=menu;
    }
    protected override bool ShowWithoutActivation { get { return true; } }
    protected override CreateParams CreateParams { get { var cp=base.CreateParams;cp.ExStyle|=0x08000080;return cp; } }
    protected override void OnMouseCaptureChanged(EventArgs e) { base.OnMouseCaptureChanged(e);if(dragging&&!Capture){dragging=false;dragged=true;host.CancelClicks();} }
    protected override void OnVisibleChanged(EventArgs e) { base.OnVisibleChanged(e); }
    internal bool HitPet(Point client) {
      float x=client.X/scale,y=client.Y/scale;var frame=blink?Pet.Blink:Pet.Idle;
      // Include the existing one-pixel black outline; sparkles never become input targets.
      for(int oy=-1;oy<=1;oy++)for(int ox=-1;ox<=1;ox++) {
        float px=(x+ox-padding)/Pet.Hit.Width,py=(y+oy-padding)/Pet.Hit.Height;
        if(px>=0&&px<1&&py>=0&&py<1&&frame.GetPixel(Pet.Crop.X+(int)(px*Pet.Crop.Width),Pet.Crop.Y+(int)(py*Pet.Crop.Height)).A>0)return true;
      }
      return false;
    }
    protected override void WndProc(ref Message message) {
      if(message.Msg==0x0084&&!dragging) {
        long packed=message.LParam.ToInt64();var point=PointToClient(new Point((short)(packed&65535),(short)((packed>>16)&65535)));
        if(!HitPet(point)){message.Result=new IntPtr(-1);return;}
      }
      base.WndProc(ref message);
    }
    protected override void OnPaint(PaintEventArgs e) { base.OnPaint(e);var g=e.Graphics;g.ScaleTransform(scale,scale);g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;Pet.Draw(g,blink,Body); }
    internal void Step(bool nextBlink) {
      if(!Visible)return;
      if(blink!=nextBlink){blink=nextBlink;Invalidate();}
      Point before=Location;
      if(!host.LinedUp&&!dragging&&!hover&&!host.ClickPending(Pet.Id))Location=roamer.Next(Location,Size,Screen.FromRectangle(Bounds).WorkingArea,Math.Max(1,(int)Math.Round(scale)));

    }
    protected override void Dispose(bool disposing) { if(disposing){if(ContextMenuStrip!=null)ContextMenuStrip.Dispose();}base.Dispose(disposing); }
  }

  // The star and the Friendly Farmer. The star shows or hides every pet at once; while the
  // pets are out, each one roams the whole screen in its own PetWindow.
  internal sealed class PetsWindow : Form {
    internal const float NormalHeight=58.75f,BugHeight=58.75f,MaxPetWidth=96;
    const int LogicalWidth=20,LogicalHeight=20,StarDrop=0;
    readonly List<PetSprite> pets=new List<PetSprite>();
    readonly List<PetWindow> roaming=new List<PetWindow>();
    internal bool LinedUp;
    readonly System.Windows.Forms.Timer timer=new System.Windows.Forms.Timer { Interval=200 };
    readonly System.Windows.Forms.Timer clickTimer=new System.Windows.Forms.Timer { Interval=20 };
    readonly Stopwatch clickClock=Stopwatch.StartNew();
    readonly PetClicks clicks;
    readonly Random random;
    readonly List<string> testActions=new List<string>();
    readonly object dockGate=new object();
    PetDockTracker tracker;
    Rectangle? dockBounds,queuedDock;
    bool dockQueued,spaceConstrained;
    readonly ToolTip tooltip=new ToolTip { InitialDelay=350,ReshowDelay=100 };
    readonly ContextMenuStrip menu=new ContextMenuStrip();
    readonly bool test;
    PetSprite farmer,hover;
    int ticks;
    float scale=1;
    bool petsOut=true,blink,dragged,dragging,started,hoverStar;
    bool launcherVisible=true;
    NotifyIcon tray;
    Icon trayIcon;
    Bitmap starBitmap;
    [DllImport("user32.dll")] static extern int GetSystemMetricsForDpi(int index,uint dpi);
    [DllImport("user32.dll")] static extern bool DestroyIcon(IntPtr handle);
    Point dragMouse,dragWindow;
    Point expandedLocation;
    bool Compact { get { return !petsOut; } }
    internal PetsWindow(bool testMode,int? seed=null) {
      test=testMode;random=seed.HasValue?new Random(seed.Value):new Random();
      clicks=new PetClicks(ResolveClicks,SystemInformation.DoubleClickTime,SystemInformation.DoubleClickSize);LoadPets();
      if(!test)petsOut=PetFiles.PetsOutSetting();
      Text=test?"Astra's desktop pets - UI test":"Astra's desktop pets";
      FormBorderStyle=FormBorderStyle.None;ShowInTaskbar=test;TopMost=true;AutoScaleMode=AutoScaleMode.None;
      BackColor=Color.Magenta;TransparencyKey=Color.Magenta;StartPosition=FormStartPosition.Manual;
      SetStyle(ControlStyles.AllPaintingInWmPaint|ControlStyles.OptimizedDoubleBuffer|ControlStyles.UserPaint,true);
      var toggle=new ToolStripMenuItem("Hide the pets");toggle.Click+=delegate { SetPetsOut(!petsOut); };menu.Items.Add(toggle);
      menu.Items.Add("Open Farmer's desk",null,delegate { OpenPet(farmer); });
      menu.Items.Add("Line up on the floor",null,delegate { LineUp(); });
      menu.Items.Add("Let the pets roam",null,delegate { LinedUp=false;ShowPets(); });
      menu.Items.Add("Open the pets page in a browser",null,delegate { if(!test)PetFiles.Open(File.Exists(PetFiles.SafePath("pets.html"))?"pets.html":"cage.html"); });
      menu.Items.Add(new ToolStripSeparator());
      var startup=new ToolStripMenuItem("Start desktop pets when I sign in") { Checked=PetFiles.StartupEnabled(),CheckOnClick=true };
      startup.Click+=delegate { if(!test)PetFiles.Startup(startup.Checked);WriteStatus(); };menu.Items.Add(startup);
      menu.Items.Add("Quit desktop pets (audio recovery keeps running)",null,delegate { Close(); });
      menu.Opening+=delegate { CancelClicks();toggle.Text=petsOut?"Hide the pets":"Show the pets";startup.Checked=PetFiles.StartupEnabled(); };
      var launcherToggle=new ToolStripMenuItem("Hide desktop star");
      launcherToggle.Click+=delegate { ToggleLauncher(); };menu.Items.Insert(0,launcherToggle);
      menu.Opening+=delegate { launcherToggle.Text=launcherVisible?"Hide desktop star":"Show desktop star"; };
      ContextMenuStrip=menu;
      timer.Tick+=delegate { if(Compact)return;ticks++;bool next=ticks%20==0;if(next!=blink){blink=next;Invalidate();}foreach(var pet in roaming)pet.Step(blink); };
      clickTimer.Tick+=delegate { clicks.Advance(clickClock.ElapsedMilliseconds);if(!clicks.Pending)clickTimer.Stop(); };
      MouseDown+=Press;MouseMove+=TrackPointer;MouseUp+=Release;
      MouseLeave+=delegate { hover=null;hoverStar=false;tooltip.SetToolTip(this,null);Cursor=Cursors.Default; };
      Shown+=delegate { started=true;ApplyDpi();PositionInitial();CreatePetWindows(Screen.FromRectangle(Bounds).WorkingArea);if(!test){CreateTray();PetFiles.StartBug("--hosted");tracker=new PetDockTracker(QueueDock);tracker.Start();}SyncVisible();WriteStatus(); };
      FormClosed+=delegate { if(tray!=null)tray.Visible=false;timer.Stop();clickTimer.Stop();CancelClicks();if(tracker!=null)tracker.Dispose();ClosePetWindows();SavePosition();WriteStatus(false); };
      RefreshStarIcon();LayoutPets();
    }
    void RefreshStarIcon() {
      int pixels;try { pixels=GetSystemMetricsForDpi(49,(uint)Math.Round(scale*96)); }catch(EntryPointNotFoundException){pixels=(int)Math.Round(16*scale);}
      pixels=Math.Max(16,pixels);
      if(starBitmap!=null&&starBitmap.Width==pixels)return;
      var bitmap=new Bitmap(pixels,pixels,PixelFormat.Format32bppArgb);
      using(var g=Graphics.FromImage(bitmap)) { g.Clear(Color.Transparent);g.ScaleTransform(pixels/40f,pixels/40f);DrawStar(g); }
      var oldBitmap=starBitmap;var oldIcon=trayIcon;starBitmap=bitmap;
      IntPtr handle=bitmap.GetHicon();try { using(var temporary=Icon.FromHandle(handle))trayIcon=(Icon)temporary.Clone(); }finally{DestroyIcon(handle);}
      if(tray!=null)tray.Icon=trayIcon;
      if(oldBitmap!=null)oldBitmap.Dispose();if(oldIcon!=null)oldIcon.Dispose();
    }
    void CreateTray() {
      RefreshStarIcon();
      tray=new NotifyIcon { Icon=trayIcon,Text="Astra's Pet Apps - click to hide/show desktop star",ContextMenuStrip=menu,Visible=true };
      tray.MouseClick+=delegate(object sender,MouseEventArgs e) { if(e.Button==MouseButtons.Left)ToggleLauncher(); };
    }
    internal void ToggleLauncher() {
      CancelClicks();launcherVisible=!launcherVisible;
      if(started) { if(launcherVisible)Show();else Hide();SyncVisible(); }
      WriteStatus();
    }
    void LoadPets() {
      var registry=PetFiles.Read("pets.json");var index=(Dictionary<string,object>)PetFiles.Read("art/frames/index.json")["pets"];
      foreach(var raw in (ArrayList)registry["pets"]) { var sprite=PetSprite.Load((Dictionary<string,object>)raw,index);if(sprite.Role=="host") { if(farmer!=null)throw new InvalidDataException("There must be one Farmer.");farmer=sprite; }else pets.Add(sprite); }
      // Local-only draft roster keeps private artwork and machine paths outside the public hub.
      string drafts=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"astras-pet-apps","desktop-drafts-20261011.json");
      if(File.Exists(drafts))foreach(var raw in (ArrayList)PetFiles.Json.Deserialize<Dictionary<string,object>>(File.ReadAllText(drafts))["pets"]) {
        var entry=(Dictionary<string,object>)raw;string id=PetFiles.Text(entry,"id");
        if(!pets.Exists(p=>p.Id==id)&&farmer.Id!=id)pets.Add(PetSprite.LoadDraft(entry));
      }
      if(farmer==null||pets.Count==0)throw new InvalidDataException("The desktop pets need their Farmer and pets.");
    }
    protected override bool ShowWithoutActivation { get { return !test; } }
    protected override CreateParams CreateParams { get { var cp=base.CreateParams;if(!test)cp.ExStyle|=0x08000080;return cp; } }
    [DllImport("user32.dll")] static extern uint GetDpiForWindow(IntPtr hwnd);
    protected override void WndProc(ref Message message) {
      if(message.Msg==0x02E0) { scale=Math.Max(1,((long)message.WParam&65535)/96f);RefreshStarIcon();ResizeLogical();if(dockBounds.HasValue)PlaceDock();else ClampToScreen();Invalidate(); }
      base.WndProc(ref message);
    }
    void ApplyDpi() { try { scale=Math.Max(1,GetDpiForWindow(Handle)/96f); } catch(EntryPointNotFoundException) { using(var g=CreateGraphics())scale=Math.Max(1,g.DpiX/96f); }RefreshStarIcon();ResizeLogical(); }
    void ResizeLogical() { ClientSize=new Size((int)Math.Ceiling((Compact?20:LogicalWidth)*scale),(int)Math.Ceiling((Compact?20:LogicalHeight)*scale)); }
    internal static Point Clamp(Point point,Size size,Rectangle area) { return new Point(Math.Max(area.Left,Math.Min(area.Right-size.Width,point.X)),Math.Max(area.Top,Math.Min(area.Bottom-size.Height,point.Y))); }
    void ClampToScreen() { Location=Clamp(Location,Size,Screen.FromPoint(Location).WorkingArea); }
    void PositionInitial() {
      var work=Screen.PrimaryScreen.WorkingArea;expandedLocation=new Point(work.Left+22,work.Bottom-(int)Math.Ceiling(LogicalHeight*scale)-22);
      if(!test)using(var key=Registry.CurrentUser.OpenSubKey(PetFiles.SettingsKey))if(key!=null) {
        object x=key.GetValue("X"),y=key.GetValue("Y");if(x is int&&y is int)expandedLocation=new Point((int)x,(int)y);
      }
      Location=Compact?new Point(expandedLocation.X,expandedLocation.Y+(int)(StarDrop*scale)):expandedLocation;ClampToScreen();
      if(!Compact)expandedLocation=Location;
    }
    void SavePosition() { if(test||!started||dockBounds.HasValue)return;using(var key=Registry.CurrentUser.CreateSubKey(PetFiles.SettingsKey)){Point location=Compact?expandedLocation:Location;key.SetValue("X",location.X);key.SetValue("Y",location.Y);} }
    void SavePetsOut() { if(test)return;using(var key=Registry.CurrentUser.CreateSubKey(PetFiles.SettingsKey))key.SetValue("PetsOut",petsOut?1:0); }
    void LayoutPets() {
      // Every pet stands the same height; wide art is fitted without distortion.
      foreach(var pet in pets) { float h=pet.Id=="voicemeeter-bug"?BugHeight:NormalHeight;float w=h*pet.Crop.Width/pet.Crop.Height;if(w>MaxPetWidth){h*=MaxPetWidth/w;w=MaxPetWidth;}float size=1;
        switch(pet.Id) { case "paper-girl":size=0.78f;break;case "health-hummy":size=0.96f;break;case "voicemeeter-bug":case "portfolio-puffer":case "ghost-protocol":size=0.8f;break;case "finance-finch":size=0.85f;break;case "file-master":size=0.6f;break; }
        pet.Hit=new RectangleF(0,0,w*size,h*size); }
      float fh=NormalHeight,fw=fh*farmer.Crop.Width/farmer.Crop.Height;farmer.Hit=new RectangleF(0,0,fw,fh);
    }
    void CreatePetWindows(Rectangle area) { ClosePetWindows();LayoutPets();foreach(var pet in pets)roaming.Add(new PetWindow(this,pet,scale,random));roaming.Add(new PetWindow(this,farmer,scale,random));Scatter(area); }
    void ClosePetWindows() { foreach(var window in roaming){window.Close();window.Dispose();}roaming.Clear(); }
    // Everyone appears at once, spread over the whole working area: a shuffled grid with one
    // pet per cell and a random spot inside each cell, so nobody starts on top of anyone else.
    internal static Point[] ScatterPoints(IList<Size> sizes,Rectangle area,Random random) {
      int count=sizes.Count;var points=new Point[count];if(count==0)return points;
      int columns=Math.Max(1,Math.Min(count,(int)Math.Ceiling(Math.Sqrt(count*(double)area.Width/Math.Max(1,area.Height)))));
      int rows=(int)Math.Ceiling(count/(double)columns);
      var cells=new List<int>();for(int i=0;i<columns*rows;i++)cells.Add(i);
      for(int i=cells.Count-1;i>0;i--){int j=random.Next(i+1);int swap=cells[i];cells[i]=cells[j];cells[j]=swap;}
      double cellWidth=area.Width/(double)columns,cellHeight=area.Height/(double)rows;
      for(int i=0;i<count;i++) {
        int column=cells[i]%columns,row=cells[i]/columns;
        double x=area.Left+column*cellWidth+random.NextDouble()*Math.Max(0,cellWidth-sizes[i].Width);
        double y=area.Top+row*cellHeight+random.NextDouble()*Math.Max(0,cellHeight-sizes[i].Height);
        points[i]=Clamp(new Point((int)x,(int)y),sizes[i],area);
      }
      return points;
    }
    void Scatter(Rectangle area) { var points=ScatterPoints(roaming.ConvertAll(p=>p.Size),area,random);for(int i=0;i<roaming.Count;i++)roaming[i].Location=points[i]; }
    static bool Flies(PetSprite pet) { return pet.Kind=="bird"||pet.Kind=="ghost"||pet.Kind=="angel"||pet.Kind=="fairy"||pet.Kind=="sprite"||pet.Id=="rgbee"||pet.Id=="wifi-butterfly"||pet.Id=="mesh-moth"; }
    internal void LineUp() { ShowPets();ArrangeFloor(Screen.FromRectangle(Bounds).WorkingArea);WriteStatus(); }
    void ArrangeFloor(Rectangle area) {
      LinedUp=true;int gap=Math.Max(4,(int)(6*scale)),bottom=area.Bottom;
      foreach(bool flying in new bool[]{false,true}) {
        var group=roaming.FindAll(p=>Flies(p.Pet)==flying);int index=0;
        while(index<group.Count) {
          int end=index,width=0,height=0;
          while(end<group.Count&&(end==index||width+gap+group[end].Width<=area.Width)) { width+=(end==index?0:gap)+group[end].Width;height=Math.Max(height,group[end].Height);end++; }
          int x=area.Left+Math.Max(0,(area.Width-width)/2);
          for(int i=index;i<end;i++){var pet=group[i];pet.Location=Clamp(new Point(x,bottom-pet.Height),pet.Size,area);x+=pet.Width+gap;}
          bottom-=height+gap;index=end;
        }
      }
    }
    RectangleF ExpandedStarBounds { get { return new RectangleF(0,StarDrop,20,20); } }
    RectangleF StarBounds { get { return Compact?new RectangleF(0,0,20,20):ExpandedStarBounds; } }
    bool HitStar(Point point) { return StarBounds.Contains(new PointF(point.X/scale,point.Y/scale)); }
    internal void SetPetsOut(bool value) {
      CancelClicks();if(!Compact)expandedLocation=Location;petsOut=value;blink=false;testActions.Add(value?"show":"hide");
      if(dockBounds.HasValue)PlaceDock();else { ResizeLogical();Location=Compact?new Point(expandedLocation.X,expandedLocation.Y+(int)(StarDrop*scale)):expandedLocation;ClampToScreen(); }
      SyncVisible();Invalidate();SavePetsOut();WriteStatus();
    }
    void SyncVisible() {
      if(Compact){timer.Stop();foreach(var pet in roaming)pet.Hide();return;}
      if(started)timer.Start();
      foreach(var pet in roaming)if(started&&!pet.Visible){pet.Location=Clamp(pet.Location,pet.Size,Screen.FromRectangle(pet.Bounds).WorkingArea);pet.Show();}
    }
    internal void ShowPets() { launcherVisible=true;SetPetsOut(true);if(!Visible)Show();if(!dockBounds.HasValue)ClampToScreen();Invalidate();WriteStatus(); }
    PetSprite At(Point point) { return null; }
    internal static bool IsDrag(Point delta) { return Math.Abs(delta.X)>SystemInformation.DragSize.Width/2||Math.Abs(delta.Y)>SystemInformation.DragSize.Height/2; }
    void Press(object sender,MouseEventArgs e) { if(e.Button!=MouseButtons.Left)return;dragging=true;dragged=false;dragMouse=Cursor.Position;dragWindow=Location;Capture=true;var pet=At(e.Location);if(HitStar(e.Location))PetPress("star",Cursor.Position);else if(pet!=null)PetPress(pet.Id,Cursor.Position);else CancelClicks(); }
    void TrackPointer(object sender,MouseEventArgs e) {
      if(dragging) { Point delta=new Point(Cursor.Position.X-dragMouse.X,Cursor.Position.Y-dragMouse.Y);if(IsDrag(delta)){dragged=true;CancelClicks();}if(dragged){Location=Clamp(new Point(dragWindow.X+delta.X,dragWindow.Y+delta.Y),Size,Screen.FromPoint(Cursor.Position).WorkingArea);if(Compact)expandedLocation=new Point(Location.X,Location.Y-(int)(StarDrop*scale));}return; }
      bool star=HitStar(e.Location);PetSprite pet=At(e.Location);if(pet!=hover||star!=hoverStar){hover=pet;hoverStar=star;tooltip.SetToolTip(this,star?"Click to "+(petsOut?"hide":"show")+" pets; double-click to line up":pet==null?"Drag to move the star ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· right-click for options":farmer.Name+" ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· double-click for his desk");Cursor=pet==null&&!star?Cursors.SizeAll:Cursors.Hand;}
    }
    void Release(object sender,MouseEventArgs e) {
      if(e.Button!=MouseButtons.Left||!dragging)return;dragging=false;Capture=false;
      if(dragged){CancelClicks();if(dockBounds.HasValue)PlaceDock();SavePosition();WriteStatus();return;}
      if(HitStar(e.Location)){PetRelease("star",false);return;}
      var pet=At(e.Location);PetRelease(pet==null?null:pet.Id,false);
    }
    protected override void OnMouseCaptureChanged(EventArgs e) { base.OnMouseCaptureChanged(e);if(dragging&&!Capture){dragging=false;dragged=true;CancelClicks();if(dockBounds.HasValue)PlaceDock();SavePosition();WriteStatus();} }
    internal void PetPress(string id,Point point) { clicks.Press(id,point,clickClock.ElapsedMilliseconds);clickTimer.Start(); }
    internal void PetRelease(string id,bool drag) { clicks.Release(id,clickClock.ElapsedMilliseconds,drag);if(!clicks.Pending)clickTimer.Stop();WriteStatus(); }
    internal bool ClickPending(string id) { return clicks.PendingFor(id); }
    internal void CancelClicks() { clicks.Cancel();clickTimer.Stop(); }
    void ResolveClicks(string id,int count) {
      if(id=="star") { if(count>=2)LineUp();else SetPetsOut(!petsOut);return; }
      if(id==farmer.Id) { if(count>=2)OpenPet(farmer); }
      else { var pet=pets.Find(p=>p.Id==id);if(pet==null)return;if(count>=2)OpenPet(pet);else if(id=="voicemeeter-bug"){testActions.Add("repair:voicemeeter-bug");if(!test)PetFiles.StartBug("--repair");} }
      WriteStatus();
    }
    internal void OpenPet(PetSprite pet) {
      testActions.Add("open:"+pet.Id);if(test){WriteStatus();return;}
      if(pet.Id=="voicemeeter-bug"){PetFiles.StartBug("--status");return;}
      Uri url;if(Uri.TryCreate(pet.Interface,UriKind.Absolute,out url)) { if(url.Scheme=="https"||url.Scheme=="http")Process.Start(new ProcessStartInfo(url.AbsoluteUri){UseShellExecute=true}); }
      else if(!String.IsNullOrWhiteSpace(pet.Interface))PetFiles.Open(pet.Interface);
    }
    void QueueDock(Rectangle? bounds) {
      lock(dockGate){queuedDock=bounds;if(dockQueued||IsDisposed||Disposing)return;dockQueued=true;}
      try{BeginInvoke((MethodInvoker)delegate{lock(dockGate){dockBounds=queuedDock;dockQueued=false;}if(!dragging)PlaceDock();});}catch(InvalidOperationException){lock(dockGate)dockQueued=false;}
    }
    void PlaceDock() {
      if(!dockBounds.HasValue){spaceConstrained=false;ResizeLogical();Location=Compact?new Point(expandedLocation.X,expandedLocation.Y+(int)(StarDrop*scale)):expandedLocation;ClampToScreen();SyncVisible();Invalidate();return;}
      Rectangle frame=dockBounds.Value;int right=(int)Math.Round(frame.Left+frame.Width*154.0/192),feet=(int)Math.Round(frame.Top+frame.Height*198.0/208);
      expandedLocation=new Point(right+(int)Math.Round(14*scale),frame.Top+(frame.Height-(int)Math.Round(LogicalHeight*scale))/2);
      Rectangle area=Screen.FromRectangle(frame).WorkingArea;spaceConstrained=expandedLocation.X+(int)Math.Ceiling(LogicalWidth*scale)>area.Right||expandedLocation.Y<area.Top;
      ResizeLogical();Location=Compact?new Point(expandedLocation.X,expandedLocation.Y+(int)(StarDrop*scale)):expandedLocation;SyncVisible();Invalidate();
    }
    protected override void OnPaint(PaintEventArgs e) { base.OnPaint(e);e.Graphics.ScaleTransform(scale,scale);PaintScene(e.Graphics); }
    void PaintScene(Graphics g) {
      g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;g.SmoothingMode=SmoothingMode.None;

      float iconSize=starBitmap.Width/scale;
      g.DrawImage(starBitmap,new RectangleF(StarBounds.X+(StarBounds.Width-iconSize)/2,StarBounds.Y+(StarBounds.Height-iconSize)/2,iconSize,iconSize),new RectangleF(0,0,starBitmap.Width,starBitmap.Height),GraphicsUnit.Pixel);
    }
    // Same puffy 40-pixel star and sparkle geometry as Voicemeeter Bug's launcher.
    static void DrawStar(Graphics g,bool sparkles=false) {
      var saved=g.Save();g.SmoothingMode=SmoothingMode.AntiAlias;
      var points=new PointF[10];
      for(int i=0;i<10;i++) { double a=-Math.PI/2+i*Math.PI/5;double r=i%2==0?19:9.5;
        points[i]=new PointF(20+(float)(Math.Cos(a)*r),20+(float)(Math.Sin(a)*r)); }
      using(var fill=new SolidBrush(Color.FromArgb(255,220,35)))g.FillPolygon(fill,points);
      using(var edge=new Pen(Color.Black,1.25f)) { edge.LineJoin=LineJoin.Round;g.DrawPolygon(edge,points); }
      using(var eyes=new SolidBrush(Color.Black)) { g.FillRectangle(eyes,14,17,3,4);g.FillRectangle(eyes,23,17,3,4); }
      using(var glint=new SolidBrush(Color.White)) { g.FillRectangle(glint,14,17,1,1);g.FillRectangle(glint,23,17,1,1); }
      g.Restore(saved);
    }
    // A 1280x720 desktop in miniature: the star and Farmer in the corner, every pet out at once.
    internal void Preview(string path) {
      scale=1;RefreshStarIcon();petsOut=true;LayoutPets();
      var area=new Rectangle(0,0,1280,720);var allPets=new List<PetSprite>(pets);allPets.Add(farmer);var sizes=allPets.ConvertAll(p=>new Size((int)Math.Ceiling(p.Hit.Width+8),(int)Math.Ceiling(p.Hit.Height+8)));
      var spots=ScatterPoints(sizes,area,random);
      using(var bitmap=new Bitmap(area.Width,area.Height,PixelFormat.Format32bppArgb))using(var g=Graphics.FromImage(bitmap)) {
        g.Clear(Color.FromArgb(27,24,38));
        var saved=g.Save();g.TranslateTransform(22,area.Height-LogicalHeight-22);PaintScene(g);g.Restore(saved);
        g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;
        for(int i=0;i<allPets.Count;i++)allPets[i].Draw(g,false,new RectangleF(spots[i].X+4,spots[i].Y+4,allPets[i].Hit.Width,allPets[i].Hit.Height));
        bitmap.Save(path,ImageFormat.Png);
      }
    }
    internal void WriteStatus(bool running=true) {
      if(test&&!started)return;
      int needed=(int)Math.Ceiling(LogicalWidth*scale);Rectangle area=Screen.FromRectangle(dockBounds??Bounds).WorkingArea;
      int sparkleCount=0;foreach(var pet in roaming)sparkleCount+=pet.SparkleCount;
      PetFiles.WriteStatus(new { running,test_mode=test,process_id=Process.GetCurrentProcess().Id,window_title=Text,visible=running&&Visible,desktop_star_visible=running&&launcherVisible,tray_visible=running&&tray!=null&&tray.Visible,star_icon_pixels=starBitmap.Width,desktop_star_pixels=starBitmap.Width,pets_out=petsOut,lined_up=LinedUp,compact=Compact,roaming_pet_count=roaming.Count,roaming_pet_visible_count=roaming.FindAll(p=>p.Visible).Count,pending_clicks=clicks.Pending,last_action=testActions.Count>0?testActions[testActions.Count-1]:null,actions=test?testActions.ToArray():null,pet_count=pets.Count+1,farmer_roaming=roaming.Exists(p=>p.Pet==farmer),dock_sample_interval_ms=16,bug_present=pets.Exists(p=>p.Id=="voicemeeter-bug"),bug_height=pets.Find(p=>p.Id=="voicemeeter-bug").Hit.Height,normal_height=NormalHeight,paper_girl_height=pets.Find(p=>p.Id=="paper-girl").Hit.Height,paper_girl_width=pets.Find(p=>p.Id=="paper-girl").Hit.Width,file_master_height=pets.Find(p=>p.Id=="file-master").Hit.Height,file_master_width=pets.Find(p=>p.Id=="file-master").Hit.Width,desktop_art_pets=roaming.FindAll(p=>p.Pet.DesktopArt).ConvertAll(p=>p.Pet.Id).ToArray(),sparkle_pet_ids=roaming.FindAll(p=>p.HasSparkles).ConvertAll(p=>p.Pet.Id).ToArray(),sparkle_count=sparkleCount,sparkle_lifetime_ms=0,sparkle_padding=0,sparkles_allowed=false,animation_interval_ms=timer.Interval,animation_running=running&&timer.Enabled,startup_enabled=PetFiles.StartupEnabled(),dpi_scale=scale,width=Width,height=Height,docked=dockBounds.HasValue,dock_has_room=!spaceConstrained,dock_required_width_px=needed,dock_available_width_px=area.Right-expandedLocation.X,dock_star_left_must_be_at_or_before_px=area.Right-needed,on_screen=Screen.FromRectangle(Bounds).WorkingArea.IntersectsWith(Bounds),updated_utc=DateTime.UtcNow.ToString("o")},test);
    }
    internal void SelfTest() {
      if(pets.Count<1||farmer==null)throw new Exception("Roster test failed.");
      if(BugHeight!=NormalHeight)throw new Exception("Bug standard size test failed.");
      if(StarBounds.Right>LogicalWidth||StarBounds.Bottom>LogicalHeight)throw new Exception("Star layout overflow.");
      foreach(var pet in pets)if(pet.Hit.Height>NormalHeight+.01f||pet.Hit.Width>MaxPetWidth+.01f||pet.Hit.Width<1)throw new Exception("Pet size out of range: "+pet.Name);
      var paper=pets.Find(p=>p.Id=="paper-girl");var files=pets.Find(p=>p.Id=="file-master");
      if(Math.Abs(paper.Hit.Height-Math.Min(NormalHeight,MaxPetWidth*paper.Crop.Height/paper.Crop.Width)*.78f)>.01f||Math.Abs(files.Hit.Height-Math.Min(NormalHeight,MaxPetWidth*files.Crop.Height/files.Crop.Width)*.6f)>.01f)throw new Exception("Paper Girl or File Master resize failed.");

      Rectangle left=new Rectangle(-1920,0,1920,1080);Size size=new Size(690,172);
      if(Clamp(new Point(9999,9999),size,left)!=new Point(-690,908))throw new Exception("Screen clamp failed.");
      if(!PetFiles.StartupCommand.StartsWith("\""+PetFiles.Exe+"\" \""))throw new Exception("Startup quoting failed.");
      bool rejected=false;try{PetFiles.SafePath("../outside.png");}catch(InvalidDataException){rejected=true;}if(!rejected)throw new Exception("Asset path validation failed.");
      bool initialPets=petsOut;ToggleLauncher();if(launcherVisible||petsOut!=initialPets)throw new Exception("Tray hide changed pet visibility state.");
      ToggleLauncher();if(!launcherVisible||petsOut!=initialPets)throw new Exception("Tray show changed pet visibility state.");
      ClickTests();
      CreatePetWindows(left);
      if(roaming.Count!=pets.Count+1||!roaming.Exists(p=>p.Pet==farmer))throw new Exception("Not every pet got its own window.");
      int sparklePets=0;
      foreach(var pet in roaming) {
        if(pet.Width>110||pet.Height>110||pet.Visible)throw new Exception("Pet windows must be compact and hidden in self-test.");
        if(pet.HasSparkles){sparklePets++;if(pet.HitPet(new Point(2,2)))throw new Exception("Transparent pet padding must pass mouse input through.");}
        bool requested=false;
        if(pet.HasSparkles!=requested)throw new Exception("Sparkles assigned to the wrong pet.");
      }
      if(sparklePets!=0)throw new Exception("No pets should have sparkle trails.");
      ArrangeFloor(left);foreach(var pet in roaming){if(!left.Contains(pet.Bounds))throw new Exception("Lineup left screen.");foreach(var other in roaming)if(pet!=other&&pet.Bounds.IntersectsWith(other.Bounds))throw new Exception("Lineup overlaps.");}foreach(var flyer in roaming.FindAll(p=>Flies(p.Pet)))foreach(var ground in roaming.FindAll(p=>!Flies(p.Pet)))if(flyer.Bottom>ground.Top)throw new Exception("Flying row must be above ground pets.");ResolveClicks("star",2);if(!LinedUp||!petsOut)throw new Exception("Star double click did not line up pets.");LinedUp=false;ScatterTests(left);ScatterTests(new Rectangle(0,0,2560,1392));RoamTests(new Rectangle(0,0,1920,1032));
      SetPetsOut(false);if(petsOut||!Compact)throw new Exception("The star did not hide the pets.");
      SetPetsOut(true);if(!petsOut||Compact)throw new Exception("The star did not show the pets.");
      foreach(var pet in roaming)if(pet.Visible)throw new Exception("Self-test must never show a pet window.");
      if(testActions.Exists(a=>a.StartsWith("open:")||a.StartsWith("repair:")))throw new Exception("Self-test dispatched an unintended app action.");
      Console.WriteLine("PASS: roster, decoded sprites, layout, Paper Girl and File Master sizes, standard-size Bug, monitor clamping, startup quoting, asset boundaries, click classification, drag cancellation, one compact window per pet, whole-screen scatter, bounded roaming, sparkle trails disabled for all pets, transparent sparkle hit-testing and star show/hide.");
    }
    void ScatterTests(Rectangle area) {
      for(int run=0;run<25;run++) {
        Scatter(area);
        var boxes=roaming.ConvertAll(p=>p.Bounds);
        foreach(var box in boxes)if(!area.Contains(box))throw new Exception("A scattered pet started off the screen.");
        // Whole screen: every third across, every third down and every quarter has a pet.
        int[] across=new int[3],down=new int[3],quadrants=new int[4];
        foreach(var box in boxes) {
          int x=box.X+box.Width/2-area.Left,y=box.Y+box.Height/2-area.Top;
          across[Math.Min(2,x*3/area.Width)]++;down[Math.Min(2,y*3/area.Height)]++;quadrants[(x<area.Width/2?0:1)+(y<area.Height/2?0:2)]++;
        }
        foreach(int n in across)if(n==0)throw new Exception("Pets did not spread across the whole screen.");
        foreach(int n in down)if(n==0)throw new Exception("Pets did not spread down the whole screen.");
        foreach(int n in quadrants)if(n==0)throw new Exception("A quarter of the screen started empty.");
        for(int i=0;i<boxes.Count;i++)for(int j=i+1;j<boxes.Count;j++)if(Rectangle.Intersect(boxes[i],boxes[j]).Width*Rectangle.Intersect(boxes[i],boxes[j]).Height>boxes[i].Width*boxes[i].Height/2)throw new Exception("Two pets started on top of each other.");
      }
    }
    void RoamTests(Rectangle area) {
      var walker=new Roamer(new Random(7));Point at=new Point(area.Left+area.Width/2,area.Top+area.Height/2);Size size=new Size(70,70);
      int minX=at.X,maxX=at.X,minY=at.Y,maxY=at.Y,still=0;
      for(int i=0;i<20000;i++) {
        Point next=walker.Next(at,size,area,1);
        if(!area.Contains(new Rectangle(next,size)))throw new Exception("A roaming pet left the screen.");
        if(Math.Abs(next.X-at.X)>2||Math.Abs(next.Y-at.Y)>1)throw new Exception("A roaming pet jumped.");
        if(next==at)still++;at=next;minX=Math.Min(minX,at.X);maxX=Math.Max(maxX,at.X);minY=Math.Min(minY,at.Y);maxY=Math.Max(maxY,at.Y);
      }
      if(maxX-minX<area.Width/3||maxY-minY<area.Height/4)throw new Exception("A roaming pet did not wander.");
      if(still==0||still>8000)throw new Exception("Roaming pets should rest now and then, not stand still.");
    }
    static void ClickTests() {
      var got=new List<string>();var classifier=new PetClicks((id,n)=>got.Add(id+":"+n),500,new Size(8,8));Point point=new Point(100,100);
      classifier.Press("farmer",point,0);classifier.Release("farmer",30,false);classifier.Advance(501);if(String.Join(",",got)!="farmer:1")throw new Exception("Single click classification failed.");got.Clear();
      classifier.Press("farmer",point,1000);classifier.Release("farmer",1030,false);classifier.Press("farmer",point,1400);classifier.Advance(1600);if(got.Count!=0)throw new Exception("Held second click dispatched early.");classifier.Release("farmer",1630,false);classifier.Advance(1901);if(String.Join(",",got)!="farmer:2")throw new Exception("Double click classification failed.");got.Clear();
      for(int i=0;i<3;i++){classifier.Press("farmer",point,2000+i*200);classifier.Release("farmer",2030+i*200,false);}classifier.Advance(3000);if(String.Join(",",got)!="farmer:2,farmer:1")throw new Exception("A third click must start a new gesture, not open the desk twice.");got.Clear();
      classifier.Press("voicemeeter-bug",point,4000);classifier.Release("voicemeeter-bug",4030,false);classifier.Press("voicemeeter-bug",point,4200);classifier.Release("voicemeeter-bug",4230,false);classifier.Advance(5000);if(String.Join(",",got)!="voicemeeter-bug:2")throw new Exception("Bug double click also repaired.");got.Clear();
      classifier.Press("farmer",point,6000);classifier.Release("farmer",6030,false);classifier.Press("farmer",point,6200);classifier.Cancel();classifier.Release("farmer",6300,true);classifier.Advance(7000);if(got.Count!=0)throw new Exception("Drag did not cancel pending clicks.");
      classifier.Press("goldfish",point,8000);classifier.Release("goldfish",8030,false);classifier.Press("chip",point,8200);classifier.Release("chip",8230,false);classifier.Advance(9000);if(String.Join(",",got)!="chip:1")throw new Exception("Clicks merged across actors.");got.Clear();
      classifier.Press("farmer",point,9200);classifier.Release("farmer",9230,false);classifier.Press("goldfish",point,9300);classifier.Release("goldfish",9330,false);classifier.Advance(9900);if(String.Join(",",got)!="goldfish:1"||classifier.Pending)throw new Exception("Actor switch kept a stale gesture.");got.Clear();
      classifier.Press("farmer",point,10000);classifier.Release("farmer",10030,false);classifier.Press("farmer",new Point(200,100),10200);classifier.Release("farmer",10230,false);classifier.Advance(11000);if(String.Join(",",got)!="farmer:1,farmer:1")throw new Exception("Double click rectangle ignored.");
    }
    protected override void Dispose(bool disposing) { if(disposing){if(tray!=null){tray.Visible=false;tray.Dispose();}if(starBitmap!=null)starBitmap.Dispose();if(trayIcon!=null)trayIcon.Dispose();if(tracker!=null)tracker.Dispose();ClosePetWindows();clickTimer.Dispose();timer.Dispose();tooltip.Dispose();menu.Dispose();foreach(var pet in pets)pet.Dispose();if(farmer!=null)farmer.Dispose();}base.Dispose(disposing); }
  }

  internal sealed class CommandListener : IDisposable {
    readonly EventWaitHandle show,quit,check,toggleStar,lineUp,stop=new EventWaitHandle(false,EventResetMode.ManualReset);
    readonly Thread thread;
    internal CommandListener(PetsWindow window,string suffix) {
      show=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-show");quit=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-quit");check=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-check");
      toggleStar=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-toggle-star");
      lineUp=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-line-up");thread=new Thread(delegate() { while(true){int action=WaitHandle.WaitAny(new WaitHandle[]{show,quit,check,toggleStar,stop,lineUp});if(action==4)return;try{window.BeginInvoke((MethodInvoker)delegate{if(action==0)window.ShowPets();else if(action==1)window.Close();else if(action==3)window.ToggleLauncher();else if(action==5)window.LineUp();else window.WriteStatus();});}catch(InvalidOperationException){return;}} }) { IsBackground=true,Name="Desktop pets command events" };thread.Start();
    }
    public void Dispose() { stop.Set();thread.Join(1000);show.Dispose();quit.Dispose();check.Dispose();toggleStar.Dispose();lineUp.Dispose();stop.Dispose(); }
  }

  internal static class Program {
    [STAThread] static int Main(string[] args) {
      if(args.Length<1)return 2;
      try {
        PetFiles.Root=Path.GetFullPath(args[0]).TrimEnd(Path.DirectorySeparatorChar);string mode=args.Length>1?args[1]:"";bool test=mode=="--test-ui";string suffix=test?"-test":"";
        if(mode=="--install-startup"){PetFiles.Startup(true);Console.WriteLine("Desktop pets login startup enabled.");return 0;}
        if(mode=="--remove-startup"){PetFiles.Startup(false);Console.WriteLine("Desktop pets login startup removed.");return 0;}
        if(mode=="--line-up")return PetFiles.Signal("line-up")?0:1;
        if(mode=="--toggle-star")return PetFiles.Signal("toggle-star")?0:1;
        if(mode=="--quit"||mode=="--quit-test")return PetFiles.Signal("quit",mode=="--quit-test"?"-test":"")?0:1;
        if(mode=="--check"||mode=="--check-test") { bool testCheck=mode=="--check-test";string path=testCheck?PetFiles.TestStateFile:PetFiles.StateFile;DateTime since=DateTime.UtcNow;bool running=PetFiles.Signal("check",testCheck?"-test":"");if(!running)PetFiles.WriteStatus(new{running=false,startup_enabled=PetFiles.StartupEnabled(),updated_utc=DateTime.UtcNow.ToString("o")},testCheck);else for(int i=0;i<25;i++){Thread.Sleep(40);if(File.Exists(path)&&File.GetLastWriteTimeUtc(path)>=since)break;}Console.WriteLine(File.ReadAllText(path));return running?0:1; }
        Application.EnableVisualStyles();Application.SetCompatibleTextRenderingDefault(false);
        if(mode=="--preview"||mode=="--self-test")using(var window=new PetsWindow(true,20261009)) { if(mode=="--self-test")window.SelfTest();else{string path=args.Length>2?Path.GetFullPath(args[2]):Path.Combine(PetFiles.Root,"desktop-pets-preview-20261008.png");window.Preview(path);Console.WriteLine(path);}return 0; }
        using(var mutex=new Mutex(false,PetFiles.Identity+suffix)) {
          bool own=false;try{own=mutex.WaitOne(0);}catch(AbandonedMutexException){own=true;}
          if(!own){if(mode!="--startup")PetFiles.Signal("show",suffix);return 0;}
          try { using(var window=new PetsWindow(test)) { IntPtr hwnd=window.Handle;using(var listener=new CommandListener(window,suffix))Application.Run(window); } }finally{mutex.ReleaseMutex();}
        }
        return 0;
      } catch(Exception error) { Console.Error.WriteLine(error.Message);try{PetFiles.WriteStatus(new{running=false,error=error.Message,updated_utc=DateTime.UtcNow.ToString("o")});}catch{}return 1; }
    }
  }
}
