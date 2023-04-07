/* 
    Automate scraping of trending javascript repositories and developers' details from the GitHub, Trending page 
    using Puppeteer or Cheerio You are required to use Puppeteer or Cheerio to automate the process of scraping data
    from the GitHub Trending page and store the extracted data in a JSON object.
    URL - https://www.github.com/trending

    3. Store the extracted data in a JSON and console.log it

    4. Your JSON should look like this as shown in the video -

    https://drive.google.com/file/d/1rZUeB20tQ6YSO5a5tBsAC2tEq3nzWKc-/view

*/

//importing puppeteer

var puppeteer  = require('puppeteer');

async function extractData(){
    //creating a browser
    var browser = await puppeteer.launch({headless: true});

    //creating a new page
    var page = await browser.newPage();

    // accesing the website
    await page.goto("https://github.com/trending");

    await page.waitForSelector('.Box-row');

    var repos = await page.evaluate(function(){
        var repoArr=[];
        var reposElement = Array.from(document.querySelectorAll('.Box-row'));
        //Here repo is returned as object so we convert it into array using Array.from();

        reposElement.forEach((repo)=>{
            //Here I've the access of repo Element
            //I need to extract the title of the repo

            var titleData = repo.querySelector('h1').innerText;
             // removing the extra characters and spaces
             titleData.replace(" ","");
             
             var descriptionData = "";
             if(repo.querySelector("p"))
             {
                descriptionData = repo.querySelector('p').innerText;
             };

             // Here if condition above is used to check if the data description exists for the repo
             // and if it exists only, we'll extract the data.

             var programmingLanguage = "";
             if(repo.querySelector("span[itemprop = 'programmingLanguage']"))
             {
                programmingLanguage = repo.querySelector("span[itemprop = 'programmingLanguage']").innerText;
             }

             var urlData = "";
             var starUrl = "";
            if(repo.querySelector("h1 > a"))
            {
               urlData = repo.querySelector("h1 > a").href;
               starUrl = repo.querySelector("h1 > a").getAttribute('href');
            }
            var forkUrl = starUrl + '/forks';
            starUrl = starUrl + "/stargazers";            
            var starData = repo.querySelector(`a[href = '${starUrl}']`).innerText;

            
            var forkData = repo.querySelector(`a[href = '${forkUrl}']`).innerText;


             
            repoArr.push({
                title : titleData, 
                description : descriptionData,
                language : programmingLanguage,
                url : urlData,
                stars : starData,
                forks : forkData
            }); 
            // if the key and value have the same name, we can use '{title}' instead of '{title: title}'

        });
        return repoArr;
    })

    //$ is a shorthand method for 'document.querySelector'
    // $ - document.querySelector && $$ - document.querySelectorAll
    var developerElement = await page.$("a[href ='/trending/developers']");
    await developerElement.click();

    await page.waitForSelector("a[href='/trending/developers/javascript?since=daily']");

    var jsSelector = await page.evaluate(()=>{
        return document.querySelector("a[href='/trending/developers/javascript?since=daily']").click();
    });
    

    var developers = await page.evaluate(()=>{
        var developersArr = [];
        var developersRows = Array.from(document.querySelectorAll('.Box-row'));
        developersRows.forEach((developer)=>{
            var name = developer.querySelector(".h3").innerText;
            var repoData = developer.querySelector(".h3").innerText;
            var descriptionData = "";
            if(developer.querySelectorAll(".f6")[2]){
                descriptionData = developer.querySelectorAll(".f6")[2].innerText;
            }

            developersArr.push({
                name : name,
                repo : repoData,
                description : descriptionData
            })
        });
        return developersArr;
    });

    console.log(repos,developers);
    

}

extractData();