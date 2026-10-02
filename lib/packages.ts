export type Item = [string, string, string, number, number]; // title, tag, area, slot(0 am,1 pm,2 eve), ₹ per person
export type Region = { id: string; name: string; state: string; months: number[]; areas: string[]; base: { stay: number; food: number; move: number }; items: Item[] };
export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const TAGS = ["nature","food","heritage","adventure","relax","culture"];
export const REGIONS: Region[] = [
{ id:"munnar",name:"Munnar",state:"Kerala",months:[9,10,11,12,1,2,3],areas:["Munnar Town","Top Station","Marayoor"],base:{stay:1200,food:500,move:400},items:[
["Sunrise at Top Station","nature","Top Station",0,200],["Tea estate walk & factory","heritage","Munnar Town",0,300],["Kerala sadya lunch","food","Munnar Town",1,350],["Marayoor dolmen trek","adventure","Marayoor",1,600],["Spice garden visit","culture","Munnar Town",1,250],["Chai & journaling at the viewpoint","relax","Top Station",2,150],["Campfire & stargazing","adventure","Marayoor",2,500]]},
{ id:"puri",name:"Puri & Konark",state:"Odisha",months:[10,11,12,1,2,3],areas:["Puri","Konark","Chilika"],base:{stay:1000,food:450,move:350},items:[
["Beach sunrise at Puri","nature","Puri",0,0],["Konark Sun Temple","heritage","Konark",0,250],["Chilika dolphin boat ride","nature","Chilika",0,900],["Odia thali & dalma","food","Puri",1,300],["Raghurajpur craft village","culture","Puri",1,200],["Jagannath temple-lane walk","heritage","Puri",1,100],["Sunset surf lesson","adventure","Puri",2,700],["Seafood street dinner","food","Puri",2,400]]},
{ id:"jaipur",name:"Jaipur",state:"Rajasthan",months:[10,11,12,1,2,3],areas:["Old City","Amer","Nahargarh"],base:{stay:1300,food:550,move:400},items:[
["Amer Fort at opening","heritage","Amer",0,500],["Village cycling ride","adventure","Amer",0,600],["Hawa Mahal & bazaar walk","culture","Old City",1,200],["Lassi & kachori crawl","food","Old City",1,300],["Block-print workshop","culture","Old City",1,800],["Nahargarh sunset ramble","nature","Nahargarh",2,150],["Rooftop café & stepwell","relax","Old City",2,400]]},
{ id:"spiti",name:"Spiti Valley",state:"Himachal",months:[6,7,8,9],areas:["Kaza","Kibber","Langza"],base:{stay:1000,food:500,move:900},items:[
["Key Monastery morning","heritage","Kaza",0,100],["Langza fossil village hike","adventure","Langza",0,300],["Kibber high-altitude walk","nature","Kibber",1,200],["Thukpa & butter-tea stop","food","Kaza",1,300],["Homestay stargazing","relax","Kibber",2,200],["Monastery chant evening","culture","Kaza",2,0]]},
{ id:"kolkata",name:"Kolkata",state:"West Bengal",months:[10,11,12,1,2],areas:["North Kolkata","South Kolkata","Howrah"],base:{stay:1100,food:450,move:250},items:[
["Howrah Bridge sunrise","nature","Howrah",0,0],["Kumartuli idol-makers walk","culture","North Kolkata",0,200],["Victoria Memorial gardens","heritage","South Kolkata",0,150],["Tram ride & College Street","heritage","North Kolkata",1,150],["Phuchka & kathi-roll trail","food","South Kolkata",1,350],["Prinsep Ghat boat ride","relax","Howrah",2,300],["Bengali fish thali","food","South Kolkata",2,500],["Park Street jazz evening","culture","South Kolkata",2,600]]},
];
export const F = { Sleeper: 0.5, "3AC": 1, "2AC": 2, "1AC": 3.5 } as const;
export type Tier = keyof typeof F;
export type Opts = { regionId: string; area: string; days: number; pax: number; budget?: number; tier?: Tier; tags: string[] };
export const CURATED = [
  { id:"c1",title:"Munnar Mist Escape",line:"Tea hills, slow mornings, one proper sadya.",o:{regionId:"munnar",area:"",days:3,pax:2,tier:"3AC" as Tier,tags:["nature","relax","food"]}},
  { id:"c2",title:"Odisha Golden Triangle",line:"Puri sunrise, Konark stone, Chilika water.",o:{regionId:"puri",area:"",days:3,pax:2,tier:"3AC" as Tier,tags:["heritage","nature","food"]}},
  { id:"c3",title:"Pink City Slow Walk",line:"Forts at opening time, bazaars by afternoon.",o:{regionId:"jaipur",area:"",days:2,pax:2,tier:"3AC" as Tier,tags:["heritage","culture","food"]}},
  { id:"c4",title:"Spiti Summer Skyline",line:"Monasteries, fossil villages and big sky.",o:{regionId:"spiti",area:"",days:5,pax:2,tier:"3AC" as Tier,tags:["adventure","nature","relax"]}},
  { id:"c5",title:"Kolkata Foodie Winter",line:"Phuchka, trams and fish thali on a student budget.",o:{regionId:"kolkata",area:"",days:2,pax:2,tier:"Sleeper" as Tier,tags:["food","culture","heritage"]}},
];
function cost(r: Region, o: Opts, t: Tier, days: Item[][]) {
  const f = F[t], n = Math.max(1, o.days - 1);
  const stay = r.base.stay * f * n * o.pax, food = r.base.food * f * o.days * o.pax, move = r.base.move * f * o.days * o.pax;
  const act = days.flat().reduce((s, i) => s + i[4], 0) * o.pax;
  return { stay, food, move, act, total: stay + food + move + act };
}
export function build(o: Opts) {
  const r = REGIONS.find(x => x.id === o.regionId)!;
  const used = new Set<string>();
  const sc = (i: Item) => (o.tags.includes(i[1]) ? 2 : 0) + (o.area && i[2] === o.area ? 3 : 0);
  const days: Item[][] = Array.from({ length: o.days }, () => [0, 1, 2].map(s => {
    const c = r.items.filter(i => i[3] === s && !used.has(i[0])).sort((a, b) => sc(b) - sc(a))[0];
    if (c) { used.add(c[0]); return c; }
    return ["Free wander & local chai", "relax", o.area || r.areas[0], s, 0] as Item;
  }));
  let tier: Tier = o.tier || "Sleeper", c = cost(r, o, tier, days), fits = true;
  if (!o.tier) {
    const order: Tier[] = ["1AC", "2AC", "3AC", "Sleeper"];
    const ok = order.find(t => cost(r, o, t, days).total <= (o.budget || 0));
    tier = ok || "Sleeper"; c = cost(r, o, tier, days); fits = !!ok;
  }
  return { r, tier, days, c, fits, short: Math.max(0, c.total - (o.budget || c.total)), pp: c.total / o.pax };
}
export type Plan = ReturnType<typeof build>;

export type Season = "CONFIRMED" | "RAC" | "WL";
export const SEASON_MEANING: Record<Season, string> = { CONFIRMED: "Ideal travel window.", RAC: "Shoulder season. Good, with trade-offs.", WL: "Not the preferred season. NOMIK suggests another window." };
export const COACH_MEANING: Record<string, string> = { Sleeper: "Raw, budget, flexible", "3AC": "Balanced and comfortable", "2AC": "Premium, curated", "1AC": "High-comfort, distinctive" };
export function season(r: Region, m: number): Season {
  if (r.months.includes(m)) return "CONFIRMED";
  const adj = [((m + 10) % 12) + 1, (m % 12) + 1];
  return adj.some(a => r.months.includes(a)) ? "RAC" : "WL";
}
export const refCode = (rid: string, days: number, n: number) => `NMK-${rid.slice(0, 3).toUpperCase()}-${days}D-${String(n).padStart(3, "0")}`;
