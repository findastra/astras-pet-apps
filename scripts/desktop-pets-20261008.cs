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
    internal Rectangle Crop;
    internal RectangleF Hit;
    internal static PetSprite Load(Dictionary<string,object> entry,Dictionary<string,object> framesIndex) {
      var pet=new PetSprite { Id=PetFiles.Text(entry,"art"),Name=PetFiles.Text(entry,"pet"),Role=PetFiles.Text(entry,"role"),Interface=PetFiles.Text(entry,"interface_url"),Kind=PetFiles.Text(entry,"kind") };
      object raw;if(!framesIndex.TryGetValue(pet.Id,out raw))throw new InvalidDataException("No frames for "+pet.Name);
      var paths=(Dictionary<string,object>)((Dictionary<string,object>)raw)["frames"];
      pet.Idle=Detached(PetFiles.SafePath(PetFiles.Text(paths,"idle")));
      pet.Blink=Detached(PetFiles.SafePath(PetFiles.Text(paths,"blink")));
      pet.Crop=Rectangle.Union(AlphaBounds(pet.Idle),AlphaBounds(pet.Blink));
      return pet;
    }
    internal static Bitmap Detached(string path) { using(var original=new Bitmap(path))return new Bitmap(original); }
    internal static Rectangle AlphaBounds(Bitmap bitmap) {
      int x0=bitmap.Width,y0=bitmap.Height,x1=-1,y1=-1;
      for(int y=0;y<bitmap.Height;y++)for(int x=0;x<bitmap.Width;x++)if(bitmap.GetPixel(x,y).A>0) { x0=Math.Min(x0,x);y0=Math.Min(y0,y);x1=Math.Max(x1,x);y1=Math.Max(y1,y); }
      if(x1<x0)throw new InvalidDataException("A pet frame is empty.");return Rectangle.FromLTRB(x0,y0,x1+1,y1+1);
    }
    public void Dispose() { if(Idle!=null)Idle.Dispose();if(Blink!=null)Blink.Dispose(); }
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
    // This step's wander direction (at most two across and one up or down), or none while resting.
    internal Point Heading() {
      if(rest>0){rest--;return Point.Empty;}
      if(heading<=0) {
        heading=random.Next(15,41);
        if(random.Next(6)==0)rest=random.Next(5,16);
        do{dx=random.Next(-2,3);dy=random.Next(-1,2);}while(dx==0&&dy==0);
      }
      heading--;
      return new Point(dx,dy);
    }
    // Turn away from a side (-1 left or top, 1 right or bottom) if still heading into it.
    internal void TurnFromX(int side) { if(side*dx>0)dx=-dx; }
    internal void TurnFromY(int side) { if(side*dy>0)dy=-dy; }
    internal Point Next(Point at,Size size,Rectangle area,int step) {
      if(Heading().IsEmpty)return PetsWindow.Clamp(at,size,area);
      var next=new Point(at.X+dx*step,at.Y+dy*step);
      if(next.X<area.Left||next.X+size.Width>area.Right){dx=-dx;next.X=at.X+dx*step;}
      if(next.Y<area.Top||next.Y+size.Height>area.Bottom){dy=-dy;next.Y=at.Y+dy*step;}
      return PetsWindow.Clamp(next,size,area);
    }
  }

  // One roaming pet as the movement rules see it: where its window is, and what it is doing.
  internal sealed class Mover {
    internal string Id,Kind;
    internal int Order;
    internal float X,Y,Vx,Vy,FaceX=1,WallTop;
    internal Size Size;
    internal Roamer Wander;
    internal int Wall,WallUntil,HopAt=-100,NextHop=-1,Lift;
    internal bool Climbing,Airborne,Fleeing;
    internal float CentreX { get { return X+Size.Width/2f; } }
    internal float CentreY { get { return Y+Size.Height/2f; } }
  }

  // How each kind of pet moves, read from pets.json "pet_life": the same rules pets.html uses.
  // Sky pets keep to the top of the screen, the fish swims mid-height and everyone else walks
  // along the bottom of the working area, just above the taskbar. Humans hop, the cat climbs a
  // screen edge and leaps off, birds fly in a loose V, friends hang out, two pets play tag, and
  // hunters chase their prey, who run away. At the desktop's calm 200 ms pace a wandering pet
  // moves at most two pixels across and one up or down per step; hurrying (chasing, fleeing,
  // catching up) at most three across and two up or down. Only a leap or a fall is faster.
  // Play never changes a pet's mood.
  internal sealed class PetLife {
    internal const int Sky=0,Swim=1,Ground=2;
    static readonly int[] HopLift={3,6,3};
    readonly Dictionary<string,Dictionary<string,object>> kinds=new Dictionary<string,Dictionary<string,object>>();
    readonly List<string[]> friends=new List<string[]>(),tag=new List<string[]>(),chases=new List<string[]>();
    readonly Dictionary<int,TagGame> games=new Dictionary<int,TagGame>();
    internal sealed class TagGame { internal string It; internal int GraceUntil; }
    internal static PetLife From(Dictionary<string,object> registry) {
      var life=new PetLife();object raw;
      if(!registry.TryGetValue("pet_life",out raw)||!(raw is Dictionary<string,object>))return life;
      var rules=(Dictionary<string,object>)raw;
      if(rules.TryGetValue("kinds",out raw)&&raw is Dictionary<string,object>)
        foreach(var pair in (Dictionary<string,object>)raw)if(pair.Value is Dictionary<string,object>)life.kinds[pair.Key]=(Dictionary<string,object>)pair.Value;
      Groups(rules,"friends",life.friends);Groups(rules,"tag",life.tag);Groups(rules,"chases",life.chases);
      return life;
    }
    static void Groups(Dictionary<string,object> rules,string key,List<string[]> into) {
      object raw;if(!rules.TryGetValue(key,out raw)||!(raw is ArrayList))return;
      foreach(var group in (ArrayList)raw)if(group is ArrayList){var names=new List<string>();foreach(var name in (ArrayList)group)names.Add(Convert.ToString(name,CultureInfo.InvariantCulture));into.Add(names.ToArray());}
    }
    internal bool Knows(string kind) { return !String.IsNullOrEmpty(kind)&&kinds.ContainsKey(kind); }
    internal IEnumerable<string> Names() { foreach(var g in friends)foreach(var n in g)yield return n;foreach(var g in tag)foreach(var n in g)yield return n;foreach(var g in chases)foreach(var n in g)yield return n; }
    internal TagGame Game(int i) { TagGame game;if(!games.TryGetValue(i,out game))games[i]=game=new TagGame { It=tag[i][0] };return game; }
    internal int TagGames { get { return tag.Count; } }
    Dictionary<string,object> Rule(Mover m) { Dictionary<string,object> rule;return m.Kind!=null&&kinds.TryGetValue(m.Kind,out rule)?rule:null; }
    internal int Zone(Mover m) { var rule=Rule(m);object zone;if(rule!=null&&rule.TryGetValue("zone",out zone)){string z=Convert.ToString(zone,CultureInfo.InvariantCulture);if(z=="sky")return Sky;if(z=="swim")return Swim;}return Ground; }
    internal bool Flag(Mover m,string key) { var rule=Rule(m);object value;return rule!=null&&rule.TryGetValue(key,out value)&&value is bool&&(bool)value; }
    static bool Named(Mover m,string name) { return m.Id==name||(!String.IsNullOrEmpty(m.Kind)&&m.Kind==name); }
    internal int TagPair(Mover a,Mover b) { for(int i=0;i<tag.Count;i++){var pair=tag[i];if(pair.Length<2)continue;if((Named(a,pair[0])&&Named(b,pair[1]))||(Named(a,pair[1])&&Named(b,pair[0])))return i;}return -1; }
    // Does a hunt b right now? Tag partners take turns being "it".
    internal bool Hunts(Mover a,Mover b,int tick) {
      int i=TagPair(a,b);
      if(i>=0){var game=Game(i);return Named(a,game.It)&&!Named(b,game.It)&&tick>=game.GraceUntil;}
      foreach(var c in chases)if(c.Length>=2&&Named(a,c[0])&&Named(b,c[1]))return true;
      return false;
    }
    internal string[] FriendsOf(Mover m) { foreach(var group in friends)foreach(var name in group)if(Named(m,name))return group;return null; }
    static int IndexIn(string[] group,Mover m) { for(int i=0;i<group.Length;i++)if(Named(m,group[i]))return i;return group.Length; }
    // The top-of-window band each zone keeps to; the floor puts a pet's feet on the bottom edge.
    internal static void Band(int zone,float top,float floor,out float low,out float high) {
      float span=floor-top;
      if(zone==Sky){low=top;high=top+span*.35f;}else if(zone==Swim){low=top+span*.4f;high=top+span*.75f;}else{low=high=floor;}
    }
    static float Limit(float value,float limit) { return Math.Max(-limit,Math.Min(limit,value)); }
    static Mover Nearest(Mover p,List<Mover> list,out float distance) {
      Mover best=null;distance=float.MaxValue;
      foreach(var o in list){float d=(float)Math.Sqrt((o.CentreX-p.CentreX)*(o.CentreX-p.CentreX)+(o.CentreY-p.CentreY)*(o.CentreY-p.CentreY));if(d<distance){best=o;distance=d;}}
      return best;
    }
    // Where a pet appears when the star brings everyone out: inside its own zone's band.
    internal static int ZoneOf(PetLife life,string id,string kind) { return life.Zone(new Mover { Id=id,Kind=kind }); }

    // One step for one pet. Mirrors live() in pets.html.
    internal void Step(Mover p,IList<Mover> all,Rectangle area,int step,int tick,Random random) {
      int zone=Zone(p);bool flying=zone!=Ground;
      float left=area.Left,right=Math.Max(area.Left,area.Right-p.Size.Width),top=area.Top,floor=Math.Max(area.Top,area.Bottom-p.Size.Height);
      var others=new List<Mover>();foreach(var o in all)if(o!=p)others.Add(o);
      p.Lift=0;

      // The cat on a screen edge: climb, hang, then leap back off.
      if(p.Wall!=0) {
        p.X=p.Wall<0?left:right;
        if(p.Climbing){p.Y-=2*step;if(p.Y<=p.WallTop){p.Y=p.WallTop;p.Climbing=false;p.WallUntil=tick+random.Next(5,13);}}
        else if(tick>=p.WallUntil){p.Vx=-p.Wall*3*step;p.Vy=-2*step;p.Wall=0;p.Airborne=true;}
        Keep(p,left,right,top,floor);return;
      }
      // A leap off an edge, or a walker that was carried up and let go, comes down with gravity.
      if(!flying&&!p.Airborne&&p.Y<floor-.5f){p.Airborne=true;p.Vx=0;p.Vy=0;}
      if(p.Airborne) {
        p.Vy+=.6f*step;p.X+=p.Vx;p.Y+=p.Vy;
        if(p.X<left||p.X>right)p.Vx=-p.Vx;
        if(p.Y>=floor||flying){p.Airborne=false;p.Vx=p.Vy=0;if(!flying)p.Y=floor;}
        Keep(p,left,right,top,floor);return;
      }

      // Who matters: anything hunting me nearby, else anything I hunt.
      float fear=140*step,sight=320*step,distance;
      Mover goal=null;bool away=false;float speed=0;
      Mover threat=Nearest(p,others.FindAll(o=>Hunts(o,p,tick)),out distance);
      if(threat!=null&&distance<fear){goal=threat;away=true;speed=3*step;}
      else {
        var tagging=others.FindAll(o=>Hunts(p,o,tick)&&TagPair(p,o)>=0);
        Mover prey=tagging.Count>0?Nearest(p,tagging,out distance):Nearest(p,others.FindAll(o=>Hunts(p,o,tick)),out distance);
        if(prey!=null&&(tagging.Count>0||distance<sight)) {
          goal=prey;speed=2*step;
          if(tagging.Count>0&&distance<20*step) {
            // Caught: the other one is it now, after a moment to get away.
            int i=TagPair(p,prey);var game=Game(i);var pair=tag[i];
            game.It=Named(p,pair[0])?pair[1]:pair[0];game.GraceUntil=tick+8;
          }
        }
      }
      p.Fleeing=away;

      Point wander=p.Wander.Heading();
      float mx=wander.X*step,my=flying?wander.Y*step:0;bool inBand=true;
      if(goal!=null) {
        float dx=goal.CentreX-p.CentreX,dy=goal.CentreY-p.CentreY,d=Math.Max(1,(float)Math.Sqrt(dx*dx+dy*dy)),s=away?-1:1;
        mx=Limit(s*dx/d*speed,3*step);my=flying?Limit(s*dy/d*speed,2*step):0;inBand=false;
      } else if(Flag(p,"flock")) {
        // The first bird in the roster leads; the rest fly a loose V behind it.
        Mover leader=p;int rank=0;
        foreach(var o in others)if(o.Kind==p.Kind){if(o.Order<leader.Order)leader=o;if(o.Order<p.Order)rank++;}
        if(leader!=p) {
          int side=rank%2==1?1:-1,back=(rank+1)/2;float facing=leader.FaceX<0?-1:1;
          float gx=leader.X-facing*back*44*step+side*6*step,gy=leader.Y+side*back*18*step;
          mx=Limit(gx-p.X,3*step);my=Limit(gy-p.Y,2*step);inBand=false;
        }
      } else {
        var group=FriendsOf(p);
        if(group!=null) {
          var crew=new List<Mover>{p};foreach(var o in others)if(FriendsOf(o)==group)crew.Add(o);
          if(crew.Count>1) {
            // Hang out: walk to a spot beside the others, then stay there.
            crew.Sort((a,b)=>IndexIn(group,a).CompareTo(IndexIn(group,b)));
            float centre=0;foreach(var c in crew)centre+=c.X;centre/=crew.Count;
            float spot=centre+(crew.IndexOf(p)-(crew.Count-1)/2f)*60*step;
            mx=Math.Abs(spot-p.X)>3*step?Limit(spot-p.X,2*step):0;
          }
        }
      }

      if(flying&&inBand) {
        // Drift back to its own height: up for the sky, back to mid-water for the fish.
        float low,high;Band(zone,top,floor,out low,out high);
        if(p.Y+my<low)my=Math.Min(step,low-p.Y);else if(p.Y+my>high)my=Math.Max(-step,high-p.Y);
        if(p.Y<=low)p.Wander.TurnFromY(-1);else if(p.Y>=high)p.Wander.TurnFromY(1);
      }
      p.X+=mx;if(Math.Abs(mx)>.01f)p.FaceX=mx;
      if(flying)p.Y+=my;else p.Y=floor;

      // Reaching a side: turn round, or, for a climber, run up the edge (always when chased).
      if(p.X<=left||p.X>=right) {
        int side=p.X<=left?-1:1;
        if(Flag(p,"climbs")&&!flying&&(away||random.NextDouble()<.35)){p.Wall=side;p.Climbing=true;p.WallTop=Math.Max(top,floor-random.Next(80,241)*step);}
        else p.Wander.TurnFromX(side);
      }
      if(flying&&(p.Y<=top||p.Y>=floor))p.Wander.TurnFromY(p.Y<=top?-1:1);

      // Humans bounce along as they walk.
      if(Flag(p,"hops")&&!flying) {
        if(p.NextHop<0)p.NextHop=tick+random.Next(0,15);
        if(tick>=p.NextHop){p.HopAt=tick;p.NextHop=tick+random.Next(8,21);}
        int age=tick-p.HopAt;if(age>=0&&age<HopLift.Length)p.Lift=HopLift[age]*step;
      }
      Keep(p,left,right,top,floor);
    }
    static void Keep(Mover p,float left,float right,float top,float floor) { p.X=Math.Max(left,Math.Min(right,p.X));p.Y=Math.Max(top,Math.Min(floor,p.Y)); }
  }

  // One small input surface per pet. Transparent pixels pass through; there is never a
  // desktop-sized interception window.
  internal sealed class PetWindow : Form {
    readonly PetsWindow host;
    internal readonly PetSprite Pet;
    readonly Roamer roamer;
    readonly float scale;
    bool dragging,dragged,hover,blink;
    Point dragMouse,dragWindow;
    internal PetWindow(PetsWindow owner,PetSprite pet,float dpi,Random random) {
      host=owner;Pet=pet;scale=dpi;roamer=new Roamer(random);
      FormBorderStyle=FormBorderStyle.None;ShowInTaskbar=false;TopMost=true;AutoScaleMode=AutoScaleMode.None;BackColor=Color.Magenta;TransparencyKey=Color.Magenta;StartPosition=FormStartPosition.Manual;Text=pet.Name+" - desktop pet";
      SetStyle(ControlStyles.AllPaintingInWmPaint|ControlStyles.OptimizedDoubleBuffer|ControlStyles.UserPaint,true);
      ClientSize=new Size((int)Math.Ceiling((pet.Hit.Width+8)*scale),(int)Math.Ceiling((pet.Hit.Height+8)*scale));
      MouseEnter+=delegate { hover=true;Cursor=Cursors.Hand; };MouseLeave+=delegate { hover=false; };
      MouseDown+=delegate(object s,MouseEventArgs e) { if(e.Button!=MouseButtons.Left)return;dragging=true;dragged=false;dragMouse=Cursor.Position;dragWindow=Location;Capture=true;host.PetPress(Pet.Id,Cursor.Position); };
      MouseMove+=delegate { if(!dragging)return;Point delta=new Point(Cursor.Position.X-dragMouse.X,Cursor.Position.Y-dragMouse.Y);if(PetsWindow.IsDrag(delta)){dragged=true;host.CancelClicks();}if(dragged)Location=PetsWindow.Clamp(new Point(dragWindow.X+delta.X,dragWindow.Y+delta.Y),Size,Screen.FromPoint(Cursor.Position).WorkingArea); };
      MouseUp+=delegate(object s,MouseEventArgs e) { if(e.Button!=MouseButtons.Left||!dragging)return;dragging=false;Capture=false;host.PetRelease(ClientRectangle.Contains(e.Location)?Pet.Id:null,dragged); };
      var menu=new ContextMenuStrip();menu.Opening+=delegate{host.CancelClicks();};menu.Items.Add("Open "+pet.Name,null,delegate{host.OpenPet(Pet);});menu.Items.Add("Hide the pets",null,delegate{host.SetPetsOut(false);});ContextMenuStrip=menu;
    }
    protected override bool ShowWithoutActivation { get { return true; } }
    protected override CreateParams CreateParams { get { var cp=base.CreateParams;cp.ExStyle|=0x08000080;return cp; } }
    protected override void OnMouseCaptureChanged(EventArgs e) { base.OnMouseCaptureChanged(e);if(dragging&&!Capture){dragging=false;dragged=true;host.CancelClicks();} }
    protected override void OnPaint(PaintEventArgs e) { base.OnPaint(e);var g=e.Graphics;g.ScaleTransform(scale,scale);g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;g.DrawImage(blink?Pet.Blink:Pet.Idle,new RectangleF(4,4,Pet.Hit.Width,Pet.Hit.Height),Pet.Crop,GraphicsUnit.Pixel); }
    internal void Step(bool nextBlink) {
      if(!Visible)return;
      if(blink!=nextBlink){blink=nextBlink;Invalidate();}
      if(dragging||hover||host.ClickPending(Pet.Id))return;
      Location=roamer.Next(Location,Size,Screen.FromRectangle(Bounds).WorkingArea,Math.Max(1,(int)Math.Round(scale)));
    }
    protected override void Dispose(bool disposing) { if(disposing&&ContextMenuStrip!=null)ContextMenuStrip.Dispose();base.Dispose(disposing); }
  }

  // The star and the Friendly Farmer. The star shows or hides every pet at once; while the
  // pets are out, each one roams the whole screen in its own PetWindow.
  internal sealed class PetsWindow : Form {
    internal const float NormalHeight=58.75f,BugHeight=58.75f,MaxPetWidth=96;
    const int LogicalWidth=140,LogicalHeight=88,StarDrop=18;
    readonly List<PetSprite> pets=new List<PetSprite>();
    readonly List<PetWindow> roaming=new List<PetWindow>();
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
      menu.Items.Add("Open the pets page in a browser",null,delegate { if(!test)PetFiles.Open("pets.html"); });
      menu.Items.Add(new ToolStripSeparator());
      var startup=new ToolStripMenuItem("Start desktop pets when I sign in") { Checked=PetFiles.StartupEnabled(),CheckOnClick=true };
      startup.Click+=delegate { if(!test)PetFiles.Startup(startup.Checked);WriteStatus(); };menu.Items.Add(startup);
      menu.Items.Add("Quit desktop pets (audio recovery keeps running)",null,delegate { Close(); });
      menu.Opening+=delegate { CancelClicks();toggle.Text=petsOut?"Hide the pets":"Show the pets";startup.Checked=PetFiles.StartupEnabled(); };
      ContextMenuStrip=menu;
      timer.Tick+=delegate { if(Compact||!Visible)return;ticks++;bool next=ticks%20==0;if(next!=blink){blink=next;Invalidate();}foreach(var pet in roaming)pet.Step(blink); };
      clickTimer.Tick+=delegate { clicks.Advance(clickClock.ElapsedMilliseconds);if(!clicks.Pending)clickTimer.Stop(); };
      MouseDown+=Press;MouseMove+=TrackPointer;MouseUp+=Release;
      MouseLeave+=delegate { hover=null;hoverStar=false;tooltip.SetToolTip(this,null);Cursor=Cursors.Default; };
      Shown+=delegate { started=true;ApplyDpi();PositionInitial();CreatePetWindows(Screen.FromRectangle(Bounds).WorkingArea);if(!test){PetFiles.StartBug("--hosted");tracker=new PetDockTracker(QueueDock);tracker.Start();}SyncVisible();WriteStatus(); };
      FormClosed+=delegate { timer.Stop();clickTimer.Stop();CancelClicks();if(tracker!=null)tracker.Dispose();ClosePetWindows();SavePosition();WriteStatus(false); };
      LayoutPets();
    }
    void LoadPets() {
      var registry=PetFiles.Read("pets.json");var index=(Dictionary<string,object>)PetFiles.Read("art/frames/index.json")["pets"];
      foreach(var raw in (ArrayList)registry["pets"]) { var sprite=PetSprite.Load((Dictionary<string,object>)raw,index);if(sprite.Role=="host") { if(farmer!=null)throw new InvalidDataException("There must be one Farmer.");farmer=sprite; }else pets.Add(sprite); }
      if(farmer==null||pets.Count==0)throw new InvalidDataException("The desktop pets need their Farmer and pets.");
    }
    protected override bool ShowWithoutActivation { get { return !test; } }
    protected override CreateParams CreateParams { get { var cp=base.CreateParams;if(!test)cp.ExStyle|=0x08000080;return cp; } }
    [DllImport("user32.dll")] static extern uint GetDpiForWindow(IntPtr hwnd);
    protected override void WndProc(ref Message message) {
      if(message.Msg==0x02E0) { scale=Math.Max(1,((long)message.WParam&65535)/96f);ResizeLogical();if(dockBounds.HasValue)PlaceDock();else ClampToScreen();Invalidate(); }
      base.WndProc(ref message);
    }
    void ApplyDpi() { try { scale=Math.Max(1,GetDpiForWindow(Handle)/96f); } catch(EntryPointNotFoundException) { using(var g=CreateGraphics())scale=Math.Max(1,g.DpiX/96f); }ResizeLogical(); }
    void ResizeLogical() { ClientSize=new Size((int)Math.Ceiling((Compact?52:LogicalWidth)*scale),(int)Math.Ceiling((Compact?52:LogicalHeight)*scale)); }
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
      foreach(var pet in pets) { float h=pet.Id=="voicemeeter-bug"?BugHeight:NormalHeight;float w=h*pet.Crop.Width/pet.Crop.Height;if(w>MaxPetWidth){h*=MaxPetWidth/w;w=MaxPetWidth;}pet.Hit=new RectangleF(0,0,w,h); }
      float fh=NormalHeight,fw=fh*farmer.Crop.Width/farmer.Crop.Height;farmer.Hit=new RectangleF(60+(76-fw)/2,LogicalHeight-12-fh,fw,fh);
    }
    void CreatePetWindows(Rectangle area) { ClosePetWindows();LayoutPets();foreach(var pet in pets)roaming.Add(new PetWindow(this,pet,scale,random));Scatter(area); }
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
    RectangleF ExpandedStarBounds { get { return new RectangleF(0,StarDrop,52,52); } }
    RectangleF StarBounds { get { return Compact?new RectangleF(0,0,52,52):ExpandedStarBounds; } }
    bool HitStar(Point point) { return StarBounds.Contains(new PointF(point.X/scale,point.Y/scale)); }
    internal void SetPetsOut(bool value) {
      CancelClicks();if(!Compact)expandedLocation=Location;petsOut=value;blink=false;testActions.Add(value?"show":"hide");
      if(dockBounds.HasValue)PlaceDock();else { ResizeLogical();Location=Compact?new Point(expandedLocation.X,expandedLocation.Y+(int)(StarDrop*scale)):expandedLocation;ClampToScreen(); }
      SyncVisible();Invalidate();SavePetsOut();WriteStatus();
    }
    void SyncVisible() {
      if(Compact){timer.Stop();foreach(var pet in roaming)pet.Hide();return;}
      if(started)timer.Start();
      foreach(var pet in roaming)if(started&&!pet.Visible){pet.Location=Clamp(pet.Location,pet.Size,Screen.FromRectangle(pet.Bounds).WorkingArea);pet.Show(this);}
    }
    internal void ShowPets() { SetPetsOut(true);if(!Visible)Show();if(!dockBounds.HasValue)ClampToScreen();Invalidate();WriteStatus(); }
    PetSprite At(Point point) { if(Compact||HitStar(point))return null;return farmer.Hit.Contains(new PointF(point.X/scale,point.Y/scale))?farmer:null; }
    internal static bool IsDrag(Point delta) { return Math.Abs(delta.X)>SystemInformation.DragSize.Width/2||Math.Abs(delta.Y)>SystemInformation.DragSize.Height/2; }
    void Press(object sender,MouseEventArgs e) { if(e.Button!=MouseButtons.Left)return;dragging=true;dragged=false;dragMouse=Cursor.Position;dragWindow=Location;Capture=true;var pet=At(e.Location);if(pet!=null)PetPress(pet.Id,Cursor.Position);else CancelClicks(); }
    void TrackPointer(object sender,MouseEventArgs e) {
      if(dragging) { Point delta=new Point(Cursor.Position.X-dragMouse.X,Cursor.Position.Y-dragMouse.Y);if(IsDrag(delta)){dragged=true;CancelClicks();}if(dragged){Location=Clamp(new Point(dragWindow.X+delta.X,dragWindow.Y+delta.Y),Size,Screen.FromPoint(Cursor.Position).WorkingArea);if(Compact)expandedLocation=new Point(Location.X,Location.Y-(int)(StarDrop*scale));}return; }
      bool star=HitStar(e.Location);PetSprite pet=At(e.Location);if(pet!=hover||star!=hoverStar){hover=pet;hoverStar=star;tooltip.SetToolTip(this,star?"Click the star to "+(petsOut?"hide":"show")+" the pets":pet==null?"Drag to move the star and Farmer · right-click for options":farmer.Name+" · double-click for his desk");Cursor=pet==null&&!star?Cursors.SizeAll:Cursors.Hand;}
    }
    void Release(object sender,MouseEventArgs e) {
      if(e.Button!=MouseButtons.Left||!dragging)return;dragging=false;Capture=false;
      if(dragged){CancelClicks();if(dockBounds.HasValue)PlaceDock();SavePosition();WriteStatus();return;}
      if(HitStar(e.Location)){SetPetsOut(!petsOut);return;}
      var pet=At(e.Location);PetRelease(pet==null?null:pet.Id,false);
    }
    protected override void OnMouseCaptureChanged(EventArgs e) { base.OnMouseCaptureChanged(e);if(dragging&&!Capture){dragging=false;dragged=true;CancelClicks();if(dockBounds.HasValue)PlaceDock();SavePosition();WriteStatus();} }
    internal void PetPress(string id,Point point) { clicks.Press(id,point,clickClock.ElapsedMilliseconds);clickTimer.Start(); }
    internal void PetRelease(string id,bool drag) { clicks.Release(id,clickClock.ElapsedMilliseconds,drag);if(!clicks.Pending)clickTimer.Stop();WriteStatus(); }
    internal bool ClickPending(string id) { return clicks.PendingFor(id); }
    internal void CancelClicks() { clicks.Cancel();clickTimer.Stop(); }
    void ResolveClicks(string id,int count) {
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
      expandedLocation=new Point(right+(int)Math.Round(6*scale),feet-(int)Math.Round((LogicalHeight-12)*scale));
      Rectangle area=Screen.FromRectangle(frame).WorkingArea;spaceConstrained=expandedLocation.X+(int)Math.Ceiling(LogicalWidth*scale)>area.Right||expandedLocation.Y<area.Top;
      ResizeLogical();Location=Compact?new Point(expandedLocation.X,expandedLocation.Y+(int)(StarDrop*scale)):expandedLocation;SyncVisible();Invalidate();
    }
    protected override void OnPaint(PaintEventArgs e) { base.OnPaint(e);e.Graphics.ScaleTransform(scale,scale);PaintScene(e.Graphics); }
    void PaintScene(Graphics g) {
      g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;g.SmoothingMode=SmoothingMode.None;
      if(!Compact)g.DrawImage(blink?farmer.Blink:farmer.Idle,farmer.Hit,farmer.Crop,GraphicsUnit.Pixel);
      var saved=g.Save();g.TranslateTransform(StarBounds.X+6,StarBounds.Y+6);DrawStar(g);g.Restore(saved);
    }
    // Same puffy 40-pixel star and sparkle geometry as Voicemeeter Bug's launcher.
    static void DrawStar(Graphics g) {
      var saved=g.Save();g.SmoothingMode=SmoothingMode.AntiAlias;
      var points=new PointF[10];
      for(int i=0;i<10;i++){double a=-Math.PI/2+i*Math.PI/5;double r=i%2==0?18:10.4;points[i]=new PointF(20+(float)(Math.Cos(a)*r),20+(float)(Math.Sin(a)*r));}
      using(var path=new GraphicsPath()) {
        for(int i=0;i<10;i++){
          var before=points[(i+9)%10];var p=points[i];var next=points[(i+1)%10];
          var a=new PointF(p.X+(before.X-p.X)*.24f,p.Y+(before.Y-p.Y)*.24f);
          var b=new PointF(p.X+(next.X-p.X)*.24f,p.Y+(next.Y-p.Y)*.24f);
          if(i==0)path.StartFigure();else path.AddLine(path.GetLastPoint(),a);
          path.AddBezier(a,p,p,b);
        }
        path.CloseFigure();
        using(var shade=new PathGradientBrush(path)){shade.CenterPoint=new PointF(17,13);shade.CenterColor=Color.FromArgb(255,246,169);shade.SurroundColors=new[]{Color.FromArgb(244,178,55)};g.FillPath(shade,path);}
        using(var edge=new Pen(Color.FromArgb(125,82,37),2.1f)){edge.LineJoin=LineJoin.Round;g.DrawPath(edge,path);}
      }
      using(var shine=new Pen(Color.FromArgb(255,255,219),2)){shine.StartCap=shine.EndCap=LineCap.Round;g.DrawLine(shine,16,11,18,8);}
      using(var ink=new SolidBrush(Color.FromArgb(69,46,38))){g.FillEllipse(ink,14,18,3.1f,4.4f);g.FillEllipse(ink,23,18,3.1f,4.4f);}
      using(var smile=new Pen(Color.FromArgb(69,46,38),1.2f))g.DrawArc(smile,18,22,4,3,0,180);
      using(var cheek=new SolidBrush(Color.FromArgb(239,157,91))){g.FillEllipse(cheek,10,23,5,2.6f);g.FillEllipse(cheek,26,23,5,2.6f);}
      Sparkle(g,0,8,3);Sparkle(g,40,4,2.3f);Sparkle(g,39,32,3.1f);Sparkle(g,3,34,1.6f);g.Restore(saved);
    }
    static void Sparkle(Graphics g,float x,float y,float r){using(var brush=new SolidBrush(Color.FromArgb(255,245,174))){g.FillPolygon(brush,new[]{new PointF(x,y-r),new PointF(x+r*.32f,y-r*.32f),new PointF(x+r,y),new PointF(x+r*.32f,y+r*.32f),new PointF(x,y+r),new PointF(x-r*.32f,y+r*.32f),new PointF(x-r,y),new PointF(x-r*.32f,y-r*.32f)});}}
    // A 1280x720 desktop in miniature: the star and Farmer in the corner, every pet out at once.
    internal void Preview(string path) {
      scale=1;petsOut=true;LayoutPets();
      var area=new Rectangle(0,0,1280,720);var sizes=pets.ConvertAll(p=>new Size((int)Math.Ceiling(p.Hit.Width+8),(int)Math.Ceiling(p.Hit.Height+8)));
      var spots=ScatterPoints(sizes,area,random);
      using(var bitmap=new Bitmap(area.Width,area.Height,PixelFormat.Format32bppArgb))using(var g=Graphics.FromImage(bitmap)) {
        g.Clear(Color.FromArgb(27,24,38));
        var saved=g.Save();g.TranslateTransform(22,area.Height-LogicalHeight-22);PaintScene(g);g.Restore(saved);
        g.InterpolationMode=InterpolationMode.NearestNeighbor;g.PixelOffsetMode=PixelOffsetMode.Half;
        for(int i=0;i<pets.Count;i++)g.DrawImage(pets[i].Idle,new RectangleF(spots[i].X+4,spots[i].Y+4,pets[i].Hit.Width,pets[i].Hit.Height),pets[i].Crop,GraphicsUnit.Pixel);
        bitmap.Save(path,ImageFormat.Png);
      }
    }
    internal void WriteStatus(bool running=true) {
      if(test&&!started)return;
      int needed=(int)Math.Ceiling(LogicalWidth*scale);Rectangle area=Screen.FromRectangle(dockBounds??Bounds).WorkingArea;
      PetFiles.WriteStatus(new { running,test_mode=test,process_id=Process.GetCurrentProcess().Id,window_title=Text,visible=running&&Visible,pets_out=petsOut,compact=Compact,roaming_pet_count=roaming.Count,roaming_pet_visible_count=roaming.FindAll(p=>p.Visible).Count,pending_clicks=clicks.Pending,last_action=testActions.Count>0?testActions[testActions.Count-1]:null,actions=test?testActions.ToArray():null,pet_count=pets.Count+1,bug_present=pets.Exists(p=>p.Id=="voicemeeter-bug"),bug_height=BugHeight,normal_height=NormalHeight,animation_interval_ms=timer.Interval,animation_running=running&&timer.Enabled,startup_enabled=PetFiles.StartupEnabled(),dpi_scale=scale,width=Width,height=Height,docked=dockBounds.HasValue,dock_has_room=!spaceConstrained,dock_required_width_px=needed,dock_available_width_px=area.Right-expandedLocation.X,dock_star_left_must_be_at_or_before_px=area.Right-needed,on_screen=Screen.FromRectangle(Bounds).WorkingArea.IntersectsWith(Bounds),updated_utc=DateTime.UtcNow.ToString("o")},test);
    }
    internal void SelfTest() {
      if(pets.Count<1||farmer==null)throw new Exception("Roster test failed.");
      if(BugHeight!=NormalHeight)throw new Exception("Bug standard size test failed.");
      if(StarBounds.IntersectsWith(farmer.Hit)||StarBounds.Right>LogicalWidth||farmer.Hit.Right>LogicalWidth||farmer.Hit.Bottom>LogicalHeight)throw new Exception("Star and Farmer layout overlap or overflow.");
      foreach(var pet in pets)if(pet.Hit.Height>NormalHeight+.01f||pet.Hit.Width>MaxPetWidth+.01f||pet.Hit.Width<1)throw new Exception("Pet size out of range: "+pet.Name);
      Rectangle left=new Rectangle(-1920,0,1920,1080);Size size=new Size(690,172);
      if(Clamp(new Point(9999,9999),size,left)!=new Point(-690,908))throw new Exception("Screen clamp failed.");
      if(!PetFiles.StartupCommand.StartsWith("\""+PetFiles.Exe+"\" \""))throw new Exception("Startup quoting failed.");
      bool rejected=false;try{PetFiles.SafePath("../outside.png");}catch(InvalidDataException){rejected=true;}if(!rejected)throw new Exception("Asset path validation failed.");
      ClickTests();
      CreatePetWindows(left);
      if(roaming.Count!=pets.Count)throw new Exception("Not every pet got its own window.");
      foreach(var pet in roaming)if(pet.Width>110||pet.Height>110||pet.Visible)throw new Exception("Pet windows must be compact and hidden in self-test.");
      ScatterTests(left);ScatterTests(new Rectangle(0,0,2560,1392));RoamTests(new Rectangle(0,0,1920,1032));
      SetPetsOut(false);if(petsOut||!Compact)throw new Exception("The star did not hide the pets.");
      SetPetsOut(true);if(!petsOut||Compact)throw new Exception("The star did not show the pets.");
      foreach(var pet in roaming)if(pet.Visible)throw new Exception("Self-test must never show a pet window.");
      if(testActions.Exists(a=>a.StartsWith("open:")||a.StartsWith("repair:")))throw new Exception("Self-test dispatched an unintended app action.");
      Console.WriteLine("PASS: roster, decoded sprites, layout, standard-size Bug, monitor clamping, startup quoting, asset boundaries, click classification, drag cancellation, one compact window per pet, whole-screen scatter, bounded roaming and star show/hide.");
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
    protected override void Dispose(bool disposing) { if(disposing){if(tracker!=null)tracker.Dispose();ClosePetWindows();clickTimer.Dispose();timer.Dispose();tooltip.Dispose();menu.Dispose();foreach(var pet in pets)pet.Dispose();if(farmer!=null)farmer.Dispose();}base.Dispose(disposing); }
  }

  internal sealed class CommandListener : IDisposable {
    readonly EventWaitHandle show,quit,check,stop=new EventWaitHandle(false,EventResetMode.ManualReset);
    readonly Thread thread;
    internal CommandListener(PetsWindow window,string suffix) {
      show=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-show");quit=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-quit");check=new EventWaitHandle(false,EventResetMode.AutoReset,PetFiles.Identity+suffix+"-check");
      thread=new Thread(delegate() { while(true){int action=WaitHandle.WaitAny(new WaitHandle[]{show,quit,check,stop});if(action==3)return;try{window.BeginInvoke((MethodInvoker)delegate{if(action==0)window.ShowPets();else if(action==1)window.Close();else window.WriteStatus();});}catch(InvalidOperationException){return;}} }) { IsBackground=true,Name="Desktop pets command events" };thread.Start();
    }
    public void Dispose() { stop.Set();thread.Join(1000);show.Dispose();quit.Dispose();check.Dispose();stop.Dispose(); }
  }

  internal static class Program {
    [STAThread] static int Main(string[] args) {
      if(args.Length<1)return 2;
      try {
        PetFiles.Root=Path.GetFullPath(args[0]).TrimEnd(Path.DirectorySeparatorChar);string mode=args.Length>1?args[1]:"";bool test=mode=="--test-ui";string suffix=test?"-test":"";
        if(mode=="--install-startup"){PetFiles.Startup(true);Console.WriteLine("Desktop pets login startup enabled.");return 0;}
        if(mode=="--remove-startup"){PetFiles.Startup(false);Console.WriteLine("Desktop pets login startup removed.");return 0;}
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
