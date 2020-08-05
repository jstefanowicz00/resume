
//////////////////////////////////////////////////
// LOCATION: SERVERDEV
// FILE_NAME: SERVER.JS
//////////////////////////////////////////////////

// NODE.JS SERVER IMPLEMENTATION
const express = require('express');
const socket = require('socket.io');

//Create the server
let app = express();
let server = app.listen(9000, () => {
	console.log('server.listening...');
});

//Give public files to client
app.use(express.static('public'));

//Create input/output socket
let io = socket(server);

//Configure input/output
io.on('connection', function(client) {
	console.log('client joined: ' + client.id);

	client.emit('connection', client.id);


	//Called whenever the client emits a 'request'
	client.on('request', (ticker) => {
		(async (ticker) => {
			let data = await getStockData([ticker]);
			client.emit('completeRequest', data[0]);
		})(ticker);
	});
});


// STOCK SCRAPER IMPLEMENTATION
const puppeteer = require('puppeteer');
//Input: Stock symbol array for ex: ['AAPL', 'HTBX', 'BOXL']
//Returns: An array of stock data objects from web address
let getStockData = async (arr) => {
	//Launch the browser
	let browser = await puppeteer.launch();
	//Input: Stock symbol for ex: 'AAPL'
	//Returns: Stock data object
	let getData = async (symbol) => {
		//Navigate to stock page
		let page = await browser.newPage();
		let url = 'https://finance.yahoo.com/quote/' + symbol + '/';
		await page.goto(url);
		//Wait for page data to load
		await page.waitForSelector(
			'span[class="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)"]'
		);
		//Scrape page data and create data object
		let data = await page.evaluate(() => {
			let company = document.querySelector("#quote-header-info > div.Mt\\(15px\\) > div.D\\(ib\\).Mt\\(-5px\\).Mend\\(20px\\).Maw\\(56\\%\\)--tab768.Maw\\(52\\%\\).Ov\\(h\\).smartphone_Maw\\(85\\%\\).smartphone_Mend\\(0px\\) > div.D\\(ib\\) > h1").innerHTML;
			let price = document.querySelector('span[class="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)"]').innerHTML;
			let volume = document.querySelector('#quote-summary > div.D\\(ib\\).W\\(1\\/2\\).Bxz\\(bb\\).Pend\\(12px\\).Va\\(t\\).ie-7_D\\(i\\).smartphone_D\\(b\\).smartphone_W\\(100\\%\\).smartphone_Pend\\(0px\\).smartphone_BdY.smartphone_Bdc\\(\\$seperatorColor\\) > table > tbody > tr:nth-child(7) > td.Ta\\(end\\).Fw\\(600\\).Lh\\(14px\\) > span').innerHTML;
			return {
				company: company,
				price: price,
				volume: volume
			}
		});
		//Return the data object
		return data;
	}
	//Initiate all data fetch promises
	let promises = [];
	for(var i = 0; i < arr.length; i++) {
		promises.push(getData(arr[i]));
	}
	
	//Wait for all fetches to complete
	let data = await Promise.all(promises);
	return data;
}




