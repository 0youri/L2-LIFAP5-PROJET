suite('Tests pour le FT ', function() {
const data = 
    {
            "quote": "qotest",
            "character": "chtest",
            "image": "https://test",
            "characterDirection": "Right",
            "origin": "Les test",
            "addedBy": "p132456789",
            "_id": "testid"  
    };
const image = `<img  src="${data.image}" width="100px">`;
    
test("on verifie le formatr",function() {
        
const clc = formate_tr(data);
console.log(formate_tr(data));
        
const test =`<tr id="testid"><th>x</th>
  <td>chtest</td><td>qotest</td>
  <td class="bi bi-info-circle-fill" onclick="modalOpen('infotestid')">
  </td></tr><div id="infotestid" class="modal">
  <div class="modal-background" 
  onclick="modalClose('infotestid');"></div>
  <div class="modal-content box">
  <button class="modal-close is-large" aria-label="close" 
  onclick="modalClose('infotestid');"></button>
  <div style="float:left;"><img  src="https://test" width="100px"></div>
  <div style="line-height:50px;">
  <p><b>Citation:</b> qotest</p>
  <p><b>Personnage:</b> chtest</p>
  <p><b>Origine:</b> Les test</p>
  </div></div></div>`;


        
        chai.assert.deepEqual(clc,test);
    });
    test("on verifie le forma_tr_detail",function() {
        
        const clc = format_tr_detail(data);
        console.log(format_tr_detail(data));
        
                
const test =`<div id="infotestid" class="modal">
  <div class="modal-background" 
  onclick="modalClose('infotestid');"></div>
  <div class="modal-content box">
  <button class="modal-close is-large" aria-label="close" 
  onclick="modalClose('infotestid');"></button>
  <div style="float:left;"><img  src="https://test" width="100px"></div>
  <div style="line-height:50px;">
  <p><b>Citation:</b> qotest</p>
  <p><b>Personnage:</b> chtest</p>
  <p><b>Origine:</b> Les test</p>
  </div></div></div>`;
         
        
                
                chai.assert.deepEqual(clc,test);
            });
});

suite('Tests de randomNb ', function() {

    test('Test avec une valeur max de 2 par exemple',function(){
        const clc = randomNb(2,0);
        const resultat = 1;
        chai.assert.deepEqual(clc,resultat);

    });

});

suite('Tests de imageDirection ', function() {
    const image = "https://blog-fr.orson.io/wp-content/uploads/2017/06/9-4.jpg";

    test('Test avec une image et une direction et characterDirection',function(){
        const characterDirection = "Left";
        const direction = "Left";
        const clc = imageDirection(image,characterDirection,direction);
        const resultat = `<img src="https://blog-fr.orson.io/wp-content/uploads/2017/06/9-4.jpg" />`;
        chai.assert.deepEqual(clc,resultat);

    });
    test('Test avec une image sans direction',function(){
        const characterDirection = "Right";
        const direction = "";
        const clc = imageDirection(image,characterDirection,direction);
        const resultat = `<img src="https://blog-fr.orson.io/wp-content/uploads/2017/06/9-4.jpg" style="transform: scaleX(-1)" />`;
        chai.assert.deepEqual(clc,resultat);

    });
    test('Test avec une image sans characterDirection',function(){
        const characterDirection = "";
        const direction = "Right";
        const clc = imageDirection(image,characterDirection,direction);
        const resultat = `<img src="https://blog-fr.orson.io/wp-content/uploads/2017/06/9-4.jpg" style="transform: scaleX(-1)" />`;
        chai.assert.deepEqual(clc,resultat);

    });

});

suite('Tests de filtre_quote_character ', function() {

    test('filtre_quote_character',function(){
        const data = 
    [{
            "quote" : "qotest",
            "character" : "chtest",
            "image" : "https://test",
            "characterDirection" :"Right",
            "origin":"Les test",
            "addedBy": "p132456789",
            "_id" : "testid", 
             
    }];
        const clc = filtre_quote_character(data);
       // const resultat = ;
      //  chai.assert.deepEqual(clc,resultat);
      console.log(filtre_quote_character(data));

    });

});


/** Fonction à tester */

function randomNb(max, except)
{
  console.log("CALL randomNb(...)");
  const nb = Math.floor(Math.random() * max);
  return nb == except ? randomNb(max, except) : nb;
}

function imageDirection(image,characterDirection, direction)
{
  console.log("CALL imageDirection(...)");
  if ( (characterDirection == "Left" && direction == "Left") || 
  ( characterDirection == "Right" && direction == "Right" ) ) 
    return `<img src="${image}" />`;
  else return `<img src="${image}" style="transform: scaleX(-1)" />`;
}

function filtre_quote_character(data)
{
  console.log("CALL filtre_quote_character(...)");
  const data_html = data.map(formate_tr).join('\n');
  return data_html;
}

function formate_tr(data)
{
  console.log("CALL formate_tr(...)");
  return `<tr id="${data._id}"><th>x</th>
  <td>${data.character}</td><td>${data.quote}</td>
  <td class="bi bi-info-circle-fill" onclick="modalOpen('info${data._id}')">
  </td></tr>` + format_tr_detail(data);
}

function format_tr_detail(data)
{
  console.log("CALL format_tr_detail(...)");
  let image = `<img  src="${data.image}" width="100px">`;
  if ( data.image === "" || data.image === undefined ) image = "";
  return `<div id="info${data._id}" class="modal">
  <div class="modal-background" 
  onclick="modalClose('info${data._id}');"></div>
  <div class="modal-content box">
  <button class="modal-close is-large" aria-label="close" 
  onclick="modalClose('info${data._id}');"></button>
  <div style="float:left;">${image}</div>
  <div style="line-height:50px;">
  <p><b>Citation:</b> ${data.quote}</p>
  <p><b>Personnage:</b> ${data.character}</p>
  <p><b>Origine:</b> ${data.origin}</p>
  </div></div></div>`;
}