const buscador = document.querySelector('#search');
let mensaje = document.querySelector('#countries');
// console.log('hola');
let countries = [];
const getWeather = async (lat, lon) => {
    try{
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}.34&lon=${lon}.99&appid=376f15eb1b1274d8c85a6df3a83d5f71&lang=sp`)
    if (resp) {
        const l = await resp.json();
        return l
    }
    } catch(error){
        console.error(error.message);
    }
}
const kelvintoCelsium= (temp)=>{
    return Math.round(temp - 273.15);
}
const getCountries = async () => {
    try{
    const resp = await fetch('https://restcountries.com/v3.1/all')
    if (resp) {
        countries = await resp.json()
    }
    } catch(error){
        console.error(error.message);
    }
}
buscador.addEventListener('input', async e => {
    
    const filtro = countries.filter(pais => {
        return pais.name.common.toLowerCase().startsWith(buscador.value.toLowerCase());
    });

    console.log(filtro);
    if (buscador.value === '') {
        mensaje.innerHTML= ''
    }
    else if (filtro.length >= 10) {
        
       mensaje.innerHTML = `<h1> Demasiados paises, debe ser más específico</h1>`
    }else if(filtro.length <=10 && filtro.length !=1 ){

        mensaje.innerHTML= ''
        const bloque =document.querySelector('#countries');
        for (const pais of filtro) {
            const div = document.createElement('paises');
            div.innerHTML = `<div id:' pais-indi'>
            <h3>País: ${pais.name.common}</h3>
            <img class='bandera'src='${pais.flags.png}'>
            </div>
            `
            bloque.append(div)
        }

    }else if (filtro.length == 1){

        const p = filtro[0]
        const weatherInfo = await getWeather( p.latlng[0], p.latlng[1])
        const Habitantes = p.population
        const paisEnHTML=  `
        <div class='pais'>
        <img  id='bandera'src='${p.flags.svg}'>
        <h3>País: ${p.name.common}</h3>
        <h3>Habitantes: ${Habitantes.toLocaleString('es')}</h3>
        <h3>Capital: ${p.capital}</h3>
        <h3>Region: ${p.region}</h3>
        <h3>Temperatura:  ${kelvintoCelsium(weatherInfo.main.temp)}°C</h3>
        <h3>Clima: ${weatherInfo.weather[0].main}</h3>
        <img src='https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png'>

        </div>`
        

        const bloque =document.querySelector('#countries');

        bloque.innerHTML = paisEnHTML;
    }
});

const showLoader = () => {
    document.getElementById('loader').style.display = 'flex';
}
  

const hideLoader = () => {
    document.getElementById('loader').style.display = 'none';
}
  
showLoader();
getCountries().then(() => {
  hideLoader(); 
});

//llamo a la funcion
getCountries();