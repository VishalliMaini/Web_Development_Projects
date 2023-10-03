const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const userContainer=document.querySelector(".weather-container")
const grantAccessContainer=document.querySelector(".grant-location-container")
const searchForm=document.querySelector("[data-searchForm]")
const loadingSCreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".weather-information")
let currentTab=userTab;
const API_KEY="94bc6cfd8a21d7fa5cf82577d9df6812";
currentTab.classList.add("current-tab");
getfromSessionStorage();
function switchTab(clickedTab){
  if(clickedTab!=currentTab){
    currentTab.classList.remove("current-tab");
    currentTab=clickedTab;
    currentTab.classList.add("current-tab");
    ///search tab agar invisible hai to usse visible karo aur baki to unvisible
    if(!searchForm.classList.contains("active")){
          userInfoContainer.classList.remove("active");
          grantAccessContainer.classList.remove("active");
          searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        //ab weather be display karna padega
        getfromSessionStorage();
    }
  }
 
}
userTab.addEventListener("click",()=>{
    switchTab(userTab);
})
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})
//check if cordinates are present in sessional storage
function getfromSessionStorage(){
    const localCordinates=sessionStorage.getItem("user-coordinates")
    if(!localCordinates){
        grantAccessContainer.classList.add("active")
    }
    else{
        //agar hai to api call hogi
        const cordinates=JSON.parse(localCordinates);
        fetchUserWeatherInfo(cordinates);
    }
}
async function fetchUserWeatherInfo(cordinates){
    const {lat,lon}=cordinates;
    //loader ko dikhao aur grant ko hathao
    grantAccessContainer.classList.remove("active")
    loadingSCreen.classList.add("active");

    //API CALL

    try{
      const response=await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data=await response.json();
      loadingSCreen.classList.remove("active");
      userInfoContainer.classList.add("active")
      renderWeatherInfo(data);
    }
    catch(err){
       window.alert("UNable to locate you")
    }

}
function renderWeatherInfo(weatherInfo){
     //firstly,we have to fetch the elements
     const cityName=document.querySelector("[data-cityName]");
     const countryIcon=document.querySelector("[data-countryIcon]");
     const desc=document.querySelector("[data-weatherDesc]");
     const weatherIcon=document.querySelector("[data-weatherIcon]");
     const temp=document.querySelector("[data-temp]");
     const windspeed=document.querySelector("[data-windspeed]")
     const humidity=document.querySelector("[data-humidity]");
     const cloudiness=document.querySelector("[data-cloudiness]")
     
     //fetch values from weatherInfo  and put it in ui
     cityName.innerText=weatherInfo?.name;
     countryIcon.src=`https://flagcdn.com/160x120/${weatherInfo?.sys?.country.toLowerCase()}.png`
     
     //https://flagcdn.com/160x120/${weatherInfo?.sys?.country.toLowerCase()}.png`
     desc.innerText=weatherInfo?.weather?.[0]?.description;
     weatherIcon.src=`https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`
     temp.innerText=`${weatherInfo?.main?.temp}°C`;
     windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
     humidity.innerText=`${weatherInfo?.main?.humidity}%`;
     cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;

    }
    //adding event listner to grantaccess
    
    const grantaccessButton=document.querySelector("[data-grantedAccess]")
    grantaccessButton.addEventListener("click",getLocation);
    function getLocation(){
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
      }
      else{
        window.alert("No geolocation available")
      }
    }
function showPosition(position){
  const userCoordinates={
    lat:position.coords.latitude,
    lon:position.coords.longitude,

  }
  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);

}

function resetSearchForm() {
  const searchForm = document.getElementById("searchForm");
  searchForm.reset();
}
async function fetchSearchWeatherInfo(city){
  loadingSCreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try{
    const response=await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    const data=await response.json();
    loadingSCreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    if(data.name){
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
    else{
      window.alert("No such city found.Please try again")
     
    }
    
    resetSearchForm();
  }
  catch(err){
    window.alert("No such city found");
    console.log("no such city")
  }

}

let searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  let cityName=searchInput.value;
  if(cityName==="")return;
  else
    fetchSearchWeatherInfo(cityName);
    
   
})
