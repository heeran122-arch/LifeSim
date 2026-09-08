const jobs=[
{name:"Retail Associate",icon:"🛒",salary:500},{name:"Delivery Driver",icon:"🚚",salary:700},
{name:"Mechanic",icon:"🔧",salary:900},{name:"Police Officer",icon:"👮",salary:1100},
{name:"Firefighter",icon:"🚒",salary:1200},{name:"EMT",icon:"🚑",salary:1150},
{name:"Software Developer",icon:"💻",salary:1500},{name:"Construction Worker",icon:"🏗️",salary:950},
{name:"Business Owner",icon:"🏢",salary:2000}];
const cars=[
{name:"Metro Compact",icon:"🚗",price:8000},{name:"City SUV",icon:"🚙",price:18000},
{name:"Street Sedan",icon:"🚘",price:24000},{name:"Trail Truck",icon:"🛻",price:32000},
{name:"Performance Coupe",icon:"🏎️",price:55000},{name:"Supercar X",icon:"🏁",price:150000}];
const homes=[
["Living with parents","Apartment",12000],["Apartment","Townhouse",30000],
["Townhouse","Modern house",75000],["Modern house","Luxury house",180000]];
let state=JSON.parse(localStorage.getItem("lifeSim"))||{name:"",checking:500,savings:0,credit:650,job:"Unemployed",salary:0,level:1,day:1,cars:[],home:"Living with parents",transactions:[]};
function money(n){return "$"+Number(n).toLocaleString()}function save(){localStorage.setItem("lifeSim",JSON.stringify(state));render()}
function tx(text,amount){state.transactions.unshift({text,amount});state.transactions=state.transactions.slice(0,15)}
function levelUp(){state.level=Math.max(1,Math.floor((state.checking+state.savings+state.cars.length*2500)/5000)+1)}
function render(){
checking.textContent=money(state.checking);savings.textContent=money(state.savings);credit.textContent=state.credit;
job.textContent=state.job;salary.textContent=money(state.salary)+" / week";level.textContent=state.level;
playerLabel.textContent=state.name;cardName.textContent=state.name.toUpperCase();home.textContent=state.home;day.textContent=state.day;
carCount.textContent=state.cars.length+" car"+(state.cars.length===1?"":"s");
transactions.innerHTML=state.transactions.length?state.transactions.map(t=>`<div class="tx"><span>${t.text}</span><strong class="${t.amount<0?"negative":"positive"}">${t.amount<0?"-":"+"}${money(Math.abs(t.amount))}</strong></div>`).join(""):'<p class="muted">No transactions yet.</p>';
const current=homes.find(x=>x[0]===state.home);homeNext.textContent=current?`Next: ${current[1]} • ${money(current[2])}`:"You own the best home.";
garage.innerHTML=state.cars.length?state.cars.map(c=>`<span>🚗 ${c}</span>`).join(""):'<p class="muted">Your garage is empty.</p>';
}
function startGame(){const n=playerName.value.trim();if(!n)return alert("Enter a player name first.");state.name=n;if(!state.transactions.length)tx("Opening balance",500);loginScreen.classList.add("hidden");game.classList.remove("hidden");save()}
function resetGame(){if(confirm("Reset your virtual life?")){localStorage.removeItem("lifeSim");location.reload()}}
function showTab(id,btn){document.querySelectorAll(".tab").forEach(x=>x.classList.add("hidden"));document.getElementById(id).classList.remove("hidden");document.querySelectorAll(".tabs button").forEach(x=>x.classList.remove("active"));btn.classList.add("active")}
function visit(title,text){visitTitle.textContent=title;visitText.textContent=text}
function deposit(){if(state.checking<100)return alert("Not enough checking balance.");state.checking-=100;state.savings+=100;tx("Moved $100 to savings",-100);state.day++;save()}
function spend(amount,label){if(state.checking<amount)return alert("Not enough money.");state.checking-=amount;tx(label,-amount);state.day++;save()}
function buyFood(){spend(25,"Food")}function payBill(){spend(75,"Bill payment")}
function collectPaycheck(){if(!state.salary)return alert("Choose a job first.");state.checking+=state.salary;tx("Weekly paycheck",state.salary);levelUp();state.day++;save()}
function chooseJob(j){state.job=j.name;state.salary=j.salary;tx("Started job: "+j.name,0);save()}
function buyCar(c){if(state.checking<c.price)return alert("You need more virtual money for this car.");state.checking-=c.price;state.cars.push(c.name);tx("Bought "+c.name,-c.price);levelUp();state.day++;save()}
function upgradeHome(){const current=homes.find(x=>x[0]===state.home);if(!current)return alert("You already own the best home.");if(state.checking<current[2])return alert("Not enough virtual money.");state.checking-=current[2];state.home=current[1];tx("Upgraded to "+current[1],-current[2]);levelUp();state.day++;save()}
function newEvent(){const events=[["🚨 Police traffic mission",150],["🚒 Fire safety mission",175],["🚑 EMS community mission",160],["🎉 Community festival",100],["💼 Side gig",225]];const e=events[Math.floor(Math.random()*events.length)];state.checking+=e[1];tx(e[0],e[1]);eventText.textContent=e[0]+" Reward: "+money(e[1]);state.day++;levelUp();save();visit("Mission complete",e[0]+" You earned "+money(e[1])+".")}
jobsGrid.innerHTML=jobs.map((j,i)=>`<div class="job"><div class="icon">${j.icon}</div><h3>${j.name}</h3><p>${money(j.salary)} / week</p><button onclick="chooseJob(jobs[${i}])">${state.job===j.name?"Selected":"Choose job"}</button></div>`).join("");
carsGrid.innerHTML=cars.map((c,i)=>`<div class="car"><div class="icon">${c.icon}</div><h3>${c.name}</h3><p>${money(c.price)}</p><button onclick="buyCar(cars[${i}])">Buy vehicle</button></div>`).join("");
if(state.name){loginScreen.classList.add("hidden");game.classList.remove("hidden")}render();