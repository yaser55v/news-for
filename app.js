import staticData from "./staticData.js";
const apiKey= 'fc5f02b25fab47ffa63256f9c9a74de8'
const apiUrl= `https://newsapi.org/v2/top-headlines`
const defaultImg= "https://cdn.pixabay.com/photo/2014/05/21/22/28/old-newspaper-350376_1280.jpg"

const newsContainer = document.querySelector(".news-container");
const searchInput = document.querySelector("#search-input");
const categorySelect = document.querySelector("#category-select");
const countrySelect = document.querySelector("#country-select");
const loadMoreBtn = document.querySelector("#load-more-btn");

let currentPage = 1;
let totalResults = 0;
let currentResults = 0;
let currentCountry = "us";

displayArticles(staticData.articles);

countrySelect.addEventListener("change", () => {
  currentCountry = countrySelect.value;
  fetchNewsArticles();
});

fetch(
  `${apiUrl}?country=${currentCountry}&pageSize=20&page=${currentPage}&apiKey=${apiKey}`
)
  .then((response) => response.json())
  .then((data) => {
    totalResults = data.totalResults;
    currentResults = data.articles.length;
    displayArticles(data.articles);
  })
  .catch((error) => console.error(error));

searchInput.addEventListener("keyup", filterArticles);
categorySelect.addEventListener("change", filterArticles);
loadMoreBtn.addEventListener("click", loadMoreArticles);

function filterArticles() {
  currentPage = 1;
  fetchNewsArticles();
}

function loadMoreArticles() {
  currentPage++;
  fetchNewsArticles();
}

function fetchNewsArticles() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value.toLowerCase();

  const categoryURL = `${apiUrl}?country=${currentCountry}&category=${selectedCategory}&pageSize=20&page=${currentPage}&apiKey=${apiKey}`;

  fetch(categoryURL)
    .then((response) => response.json())
    .then((data) => {
      const filteredArticles = data.articles.filter((article) => {
        const articleTitle = article.title.toLowerCase();
        return articleTitle.includes(searchText);
      });
      displayArticles(filteredArticles);
    })
    .catch((error) => console.error(error));
}

function displayArticles(articles) {
  if (currentPage === 1) {
    newsContainer.innerHTML = "";
  }

  if (articles.length === 0) {
    const noResultsMessage = document.createElement("p");
    noResultsMessage.textContent = "No results found.";
    newsContainer.appendChild(noResultsMessage);
  } else {
    articles.forEach((article) => {
      const articleDiv = document.createElement("div");
      articleDiv.classList.add("news-card");

      const articleImage = document.createElement("img");
      articleImage.src = article.urlToImage ? article.urlToImage : defaultImg;

      const articleTitle = document.createElement("h2");
      articleTitle.textContent = article.title;

      const articleDescription = document.createElement("p");
      articleDescription.textContent = article.description;

      const articleLink = document.createElement("a");
      articleLink.href = article.url;
      articleLink.textContent = "Read more";

      articleDiv.appendChild(articleImage);
      articleDiv.appendChild(articleTitle);
      articleDiv.appendChild(articleDescription);
      articleDiv.appendChild(articleLink);

      newsContainer.appendChild(articleDiv);
    });
  }

  if (currentResults < totalResults) {
    loadMoreBtn.style.display = "block";
  } else {
    loadMoreBtn.style.display = "none";
  }
}

/* NAVBAR */

const navbarLinks = document.querySelectorAll(".navbar a");

navbarLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const category = event.target.getAttribute("href").replace("#", "");
    categorySelect.value = category;
    fetchNewsArticles();
  });
});

const navbarToggle = document.querySelector(".navbar-toggle");
const navbarMenu = document.querySelector(".navbar-menu");
const navbarItems = document.querySelectorAll(".navbar-item");

navbarToggle.addEventListener("click", () => {
  navbarToggle.classList.toggle("active");
  navbarMenu.classList.toggle("active");
});

navbarItems.forEach((item) => {
  item.addEventListener("click", () => {
    navbarMenu.classList.remove("active");
    navbarToggle.classList.remove("active");
  });
});
/* const url = `${apiUrl}?country=us&pageSize=20&page=${currentPage}&apiKey=${apiKey}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
 */
