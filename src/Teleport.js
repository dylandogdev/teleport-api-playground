import axios from "axios";

const urlBase = 'https://api.teleport.org/api/';
const allUrbanAreas = 'urban_areas/';
const uaImages = 'images/';
const uaDetails = 'details/';
const uaSalaries = 'salaries/'

export const getUrbanAreas = (setUrbanAreas) => {
  axios.get(`${urlBase}${allUrbanAreas}`).then((res) => {
    setUrbanAreas(JSON.parse(JSON.stringify(res["data"]["_links"]["ua:item"])));
  });
};

export const getUrbanArea = async (urbanArea, setUrbanArea) => {

    //I want the slug value to intuitively get the right url for lookup
    const regex = /(?<=\/)slug:(.*?)(?=\/)/;
    //yank the slug value by pulling the full text incl. 'slug:' from phrase to next slash
    const slug = regex.exec(urbanArea.href)[0];

    //Instead of chaining requests, jjst wait for them all to resolve and then set the state
    const [detailsRes, salariesRes, imagesRes] = await Promise.all([
        axios.get(`${urlBase}${allUrbanAreas}${slug}/${uaDetails}`),
        axios.get(`${urlBase}${allUrbanAreas}${slug}/${uaSalaries}`),
        axios.get(`${urlBase}${allUrbanAreas}${slug}/${uaImages}`)
    ]);

    let x = JSON.parse(JSON.stringify(detailsRes["data"]["categories"]));
    let y = JSON.parse(JSON.stringify(salariesRes["data"]["salaries"]));
    let z = JSON.parse(JSON.stringify(imagesRes["data"]["photos"]));

    setUrbanArea(
        {
            name: urbanArea.name,
            housing: {
                //This is more hard coded and way fewer errors handled than I would ever put into prod, but I am honoring the 
                //time limit. I would want to consider that JSON format will change and what user would expect
                //if data is unavailable for a certain field.
                price: x[8]?.data[2]?.currency_dollar_value || 'UNKNOWN'
            },
            salary: {
                wage25: y[45]?.salary_percentiles?.percentile_25 || 'UNKNOWN',
                wage50: y[45]?.salary_percentiles?.percentile_50 || 'UNKNOWN',
                wage75: y[45]?.salary_percentiles?.percentile_75 || 'UNKNOWN'
            },
            commute: x[19]?.data[1]?.float_value || 'UNKNOWN',
            nightOut: {
                movie: x[3]?.data[4]?.currency_dollar_value || 'UNKNOWN',
                dinner: x[3]?.data[10]?.currency_dollar_value || 'UNKNOWN',
                beer: x[3]?.data[6]?.currency_dollar_value || 'UNKNOWN'
            },
            internet: x[13]?.data[0]?.float_value || 'UNKNOWN',
            href: urbanArea.href,
            image: z[0]?.image?.web,
            fetched: true
        }
    )
}
