import { WiHumidity } from "react-icons/wi";
import { MainWrapper } from "./styles.module";
import { FaSearch } from "react-icons/fa";
import { SiWindicss } from "react-icons/si";

import {
  BsCloudyFill,
  BsFillCloudRainFill,
  BsCloudFogFill,
  BsFillSunFill,
} from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { useEffect, useState } from "react";
import axios from "axios";

interface WeatherDataProps {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    country: string;
  };
  wind: {
    speed: number;
  };
  weather: {
    main: string;
  }[];
}

const DisplayWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(null);
  const [searchCity, setSeatchCity] = useState<string>("")
  const [loading, setLoading] = useState(false);

  const api_url = "https://api.openweathermap.org/data/2.5/";
  const api_key = "da88313359f7cc6215ffacf8275a60d3";

  {
    /* fetch data (axios) */
  }
  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `${api_url}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);
    setWeatherData(response.data);
  };

  {
    /*current device location */
  }
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      Promise.all([fetchCurrentWeather(latitude, longitude)]).then(
        ([currentWeather]) => {
            setLoading(true)
          console.log(currentWeather);
        }
      );
    });
  },[]);

  {/* fetch city  */}
  const fetchWeatherData = async(city:string) => {
    try {
        const url = `${api_url}weather?q=${city}&appid=${api_key}&units=metric`;
        const searchResp = await axios.get(url);

        const currentResult:WeatherDataProps = searchResp.data;
        return {currentResult}
    } catch (error) {
        console.log(error);    
        throw error 
    }
  }
 {/* search city  */}
  const handleSearch = async () => {
    if(searchCity.trim() === ""){
        return
    }
    try {
        const {currentResult} = await fetchWeatherData(searchCity)
        setWeatherData(currentResult)
    } catch (error) {
        console.log(error);
        
    }
  }

  {/* changes the icon, depending on the weather  */}
  const iconChanger = (weather: string) => {
    let iconElement: React.ReactNode;
    let iconColor: string;

    switch (weather) {
      case "Rain":
        iconElement = <BsFillCloudRainFill />;
        iconColor = "#272829";
        break;

      case "Clear":
        iconElement = <BsFillSunFill />;
        iconColor = "#FFC436";
        break;
      case "Clouds":
        iconElement = <BsCloudyFill />;
        iconColor = "#102C57";
        break;

      case "Mist":
        iconElement = <BsCloudFogFill />;
        iconColor = "#279EFF";
        break;

      default:
        iconElement = <TiWeatherPartlySunny />;
        iconColor = "#7B2869";
    }

    return (
        <span className="icon" style={{color:iconColor}}>
          { iconElement}
        </span>
    )
  };



  return (
    <MainWrapper>
      <div className="container">
        <div className="searchArea">
          <input type="text" placeholder="Buscar Ciudad" value={searchCity} onChange={e => setSeatchCity(e.target.value)} />

          <div className="searchCircle">
            <FaSearch className="searchIcon" onClick={handleSearch} />
          </div>
        </div>

        {weatherData && loading ? (
          <>
            <div className="weatherArea">
              {/*name */}
              <h1> {weatherData.name} </h1>
              {/*country */}
              <span>{weatherData.sys.country}</span>
              <div className="icon">
                {iconChanger(weatherData.weather[0].main)}
              </div>
              {/*temp */}
              <h1> {weatherData.main.temp} °C</h1>
              <span>{weatherData.weather[0].main}</span>
            </div>

            <div className="bottomInfoArea">
              <div className="humidityLevel">
                <WiHumidity className="windIcon" />
                <div className="humidInfo">
                  <h3>{weatherData.main.humidity}%</h3>
                  <span>Humedad</span>
                </div>
              </div>
              <div className="wind">
                <SiWindicss className="windIcon" />
                <div className="humidInfo">
                  <h3>{weatherData.wind.speed}km/h</h3>
                  <span>Velocidad</span>
                </div>
              </div>
            </div>
          </>
        ) : (
            <div className="loading">
                <RiLoaderFill className="loadingIcon" />
                <p>Cargando...</p>
            </div>
        )
    }
      </div>
    </MainWrapper>
  );
};

export default DisplayWeather;
