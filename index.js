const createElements = (arr) =>{
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`)
 return htmlElements.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN";
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) =>{
  if(status == true){
    document.getElementById('spinner').classList.remove('hidden');
    document.getElementById('word-container').classList.add('hidden');
  }
  else{
    document.getElementById('word-container').classList.remove('hidden');
    document.getElementById('spinner').classList.add('hidden');
  }
}

const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
    .then(res => res.json())
    .then(json => displayLessons(json.data))
}

const removeActive = () => {
  const lessonButtons = document.querySelectorAll('.lesson-btn');
  lessonButtons.forEach(button => button.classList.remove('active'))
}

const loadLevelWord = (id) => {
  manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
       removeActive();
        const clickBtn = document.getElementById(`lesson-btn-${id}`)
        clickBtn.classList.add('active')
        displayLevelWord(data.data)
    });
};

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = ''
     
    if(words.length == 0){
        wordContainer.innerHTML = `
        <div class="text-center col-span-full space-y-6 font-bangla">
        <img class="mx-auto" src="assets/alert-error.png" alt="">
        <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="text-3xl font-bold">নেক্সট Lesson এ যান।</h2>
      </div>
        `
    }

    words.forEach(element => {
        const card = document.createElement('div');
        card.innerHTML = `
          <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
        <h2 class="text-2xl font-bold">${element.word ? element.word : 'শব্দ পাওয়া যায়নি'}</h2>
        <p class="font-semibold">Meaning /Pronounciation</p>
        <div class="font-bangla text-2xl font-medium">"${element.meaning ? element.meaning : 'অর্থ পাওয়া যায়নি'} / ${element.pronunciation ? element.pronunciation : 'pronunciation পাওয়া যায়নি'}"</div>
        <div class="flex justify-between items-center">
            <button onclick="loadWordDetail(${element.id})" class="btn bg-sky-100 hover:bg-sky-300"><i class="fa-solid fa-circle-info"></i></button>
            <button onclick="pronounceWord('${element.word}')" class="btn bg-sky-100 hover:bg-sky-300"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
        `
        wordContainer.appendChild(card)
    });
    manageSpinner(false);
}

const loadWordDetail = async(id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res =await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
}

const displayWordDetails = (word) => {
  const detailsBox = document.getElementById('details-container');
  detailsBox.innerHTML = `
    <div>
        <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>  :${word.pronunciation})</h2>
       </div>
       <div>
        <h2 class="font-bold">Meaning</h2>
        <p>${word.meaning}</p>
       </div>
       <div>
        <h2 class="font-bold">Example</h2>
        <p>${word.sentence}</p>
       </div>
       <div>
        <h2 class="font-bold">Synonym</h2>
        <div>${createElements(word.synonyms)}</div>
       </div>
    </div>
  `
  document.getElementById('my_modal_5').showModal();
}

const displayLessons = (lesson) => {
   const levelContainer = document.getElementById('level-container')
   levelContainer.innerHTML = ''
   for(let less of lesson){
    const btnDiv = document.createElement('div');
    btnDiv.innerHTML = `
      <button id="lesson-btn-${less.level_no}" onclick = "loadLevelWord(${less.level_no})" class="btn btn-outline btn-primary lesson-btn px-6"><i class="fa-solid fa-book-open"></i> Lesson-${less.level_no}</button>
    `;
    levelContainer.appendChild(btnDiv);
   }
}

loadLessons();

document.getElementById('btn-search').addEventListener('click', () => {
  removeActive();
  const input = document.getElementById('input-search');
  const searchValue = input.value.trim().toLowerCase();
  fetch('https://openapi.programming-hero.com/api/words/all')
  .then(res => res.json())
  .then(data => {
    const allWords = data.data;
    const filterWord = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
    displayLevelWord(filterWord);
  })
})