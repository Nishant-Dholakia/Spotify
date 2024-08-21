let card = document.querySelectorAll(".card");
// console.log(card);
let play = document.createElement("img");

for (let i = 0; i < card.length; i++) {
    card[i].addEventListener("mouseenter", () => {
        play.setAttribute("src", "./svg/play_button.svg");
        play.setAttribute("class", "play_button");
        card[i].append(play);

    })
    card[i].addEventListener("mouseleave", () => {
        play.remove();
    })
}