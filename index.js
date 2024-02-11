const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

const notFound = document.querySelector('.errorContainer');
const errorBtn = document.querySelector('[data-errorButton]');
const errorText = document.querySelector('[data-errorText]');
const errorImage = document.querySelector('[data-errorImg]');

let oldTab=userTab;
const API_KEY="040ffa49a56390fd3f3cd094fd64e2b8"
oldTab.classList.add("current-Tab");
 getfromSessionStorage();
// ek kaam or pending hai
function switchTab(newTab){
    
    if(newTab!==oldTab){
        oldTab.classList.remove("current-Tab");
        oldTab=newTab;
        oldTab.classList.add("current-Tab")
// kya search form container invisible if yes make it visible 
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
    else{
        // main phle search vale tab pe tha ab your weather tab visible krna pdega
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
    //    ab main your weather tab me agya hu toh weather bhi display krna pdega,so lets check local storage
    // for corodinats ,if we have saved them there.
        getfromSessionStorage();

    }
}
}
userTab.addEventListener('click',()=>{
    // pass clicked tab as input
    switchTab(userTab);
})
searchTab.addEventListener('click',()=>{
    // pass clicked tab as input
    switchTab(searchTab);

})

// check if corodinates are already present in session stor
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agar local coordinates nhi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}
 async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grantcontainer inivisible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    // API CALL
    try{
        const response=await fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data=await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        notFound.classList.add('active');
        errorImage.style.display = 'none';
        errorText.innerText = `Error: ${err?.message}`;
        errorBtn.style.display = 'block';
        errorBtn.addEventListener("click", fetchWeatherInfo);
        //hw
    }
} 
function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the elements
    const cityName=document.querySelector("[data-cityname]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    // fetch values from  and put it in UI elemenst
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp } °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}
function getLocation(){
    // kya geolocation api supported ha ki nhi then find location
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        // hw show an alert for no gelolocation support availabe
        alert("no geoloction support available")
    }
}
// jab grant acces pr click kre to current position find kro using geolocation and unko getsessionstorage me store kro
function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem=("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}


const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);
const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")
    return;
    else{
        searchInput.value="";
        fetchSearchWeatherInfo(cityName);
    }
 
})
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none";
    }

}