var chai = require('chai'); 
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should();
var supertest = require('supertest');
var randomPictionaryList = require('word-pictionary-list');

const wordListPath = require('word-list');
const fs = require('fs');
const fetch = require("node-fetch");
const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n'); 

async function getWord() {
	// Getting the wiki link for the first word
	var word = randomPictionaryList(1);
	const word_data = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${word}`)
	const word_data_json = await word_data.json()
	const link = await word_data_json[3][0]
	// Getting the definition for the first word
	const word_def_data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
	const word_def_data_json = await word_def_data.json()
	const word_def = await word_def_data_json[0]['meanings'][0]['definitions'][0]["definition"]
	// Put into an object
	const output = {word: word[0], definition: word_def, link: link}
	// console.log(output);
	return output;
	
}

async function getWords(word_count){
	words = []
	for (let i = 0; i < word_count; i++) {
		try {
			word = await getWord();
			words.push(word);
		} catch {
			console.log('Error getting word')
			i--;
		}
	}
	return words;
}




describe('Wikipedia API testing', function(done) {
	it('Fetching API link: API link successfully fetched and returns content', async () => { 
		random_word = "apple";
		const result = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${random_word}`)
		const result_json = await result.json(); 
		assert.isNotNull(result_json); 
		expect(result_json).to.be.an('array'); 
	}); 

	it('Fetching API link: returned array contains a valid Wikipedia link', async () => { 
		random_word = "apple";
		const result = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${random_word}`)
		const result_json = await result.json(); 
		expect(result_json).to.match(/wikipedia.org/); 
	}); 
});


describe('Random-word-generating function', function(done) {
    it('Return type: not null', async () => { 
        const result = await getWord();
        assert.isNotNull(result);
	});
	
	it('Return type: returned words are valid strings (testing with word_count = 3)', async () => { 
		let word_count = 3; 
		var test = await getWords(3);
		console.log(test);
		for(let i = 0; i < word_count; i++) {

			assert.isString(test[i].word);
			// var n = Math.floor(Math.random() * Math.floor(wordArray.length - 1));
			// random_word = wordArray[n]; 
			// assert.isString(random_word); 
		}	
	});
});



