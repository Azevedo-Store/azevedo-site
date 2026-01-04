// const loadFile = async () => {
//     return await fetch('prices.txt')
//     .then(response => response.text())
//     .then(text => {
//       const array = text.split("\n");
//       if(array != null)  return array.slice(1,array.length);
//       return null;
    
//     })
// };

// const init = async () => {
//    const prices =  await loadFile();
//    if(!!prices){
//     prices.forEach(element => {
//         const [price, text,quantidade, server] = element.split("[]");
//         structureElement(price,text,quantidade, server)
//     });
//    }
// };

// structureElement = (price, text,quantidade, server) => {
//     const elementContainer = document.getElementById("container-item");
//     const newDiv = document.createElement("div");

//     newDiv.classList.add("box");
//     newDiv.style.position = "relative";

//     createImage(newDiv,server)
//     createTextPrice(newDiv,price)
//     createTextDescription(newDiv,text)
//     buttonCreate(newDiv, quantidade,price);
//     elementContainer.append(newDiv);
// }

// const createImage = (newDiv,server) => {
//     const newImage = document.createElement("img");
//     newImage.src = `assets/Precos/${server.trim().toLowerCase()}.png`;
//     newDiv.append(newImage);
// }
// const createTextPrice = (newDiv,price) => {
//     const newTextPrice = document.createElement("span");
//     newTextPrice.classList.add("priceRelative", 'texto-dourado');
//     newTextPrice.innerHTML = price;
//     newDiv.append(newTextPrice);
// }
// const createTextDescription = (newDiv, text) => {
//     const newTextDescription = document.createElement("span");
//     newTextDescription.classList.add("description-price",'texto-dourado');
//     newTextDescription.innerHTML = text;
//     newDiv.append(newTextDescription)

// }

// const buttonCreate = (newDiv, quantidade,price) => {
//     const button = document.createElement("button");
//     const link = document.createElement("a");
//     const span = document.createElement("span");

//     span.classList.add("button_top")
//     span.innerHTML = "Comprar";

//     link.target = "_blank";
//     link.href = `https://wa.me/554588403532?text=Olá!%20Desejo%20adquirir%20${quantidade}%20por%20${price}%20no%20Thor,%20vim%20pelo%20site.`;

//     link.append(span)
//     button.append(link)
//     newDiv.append(button)
// }

// init();