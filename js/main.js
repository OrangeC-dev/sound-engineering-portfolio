const siteHeader = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");

if (siteHeader && menuButton && mobileNav) {
  menuButton.addEventListener("click", function () {
    const menuIsOpen = mobileNav.classList.toggle("is-open");

    siteHeader.classList.toggle("is-open", menuIsOpen);
    menuButton.setAttribute("aria-expanded", menuIsOpen);
  });

  mobileNav.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      mobileNav.classList.remove("is-open");
      siteHeader.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

const filterLists = document.querySelectorAll(".filter-list");

filterLists.forEach(function (filterList) {
  const filterButtons = filterList.querySelectorAll(".filter-button");
  const section = filterList.closest("section");
  const projectCards = section.querySelectorAll(".project-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach(function (filterButton) {
        filterButton.classList.remove("is-active");
      });

      button.classList.add("is-active");

      projectCards.forEach(function (card) {
        const cardCategory = card.dataset.category;
        const cardShouldShow = selectedFilter === "all" || selectedFilter === cardCategory;

        card.classList.toggle("is-hidden", !cardShouldShow);
      });
    });
  });
});

const images = document.querySelectorAll("img");

images.forEach(function (image) {
  image.addEventListener("error", function () {
    const imageWrapper = image.parentElement;

    if (imageWrapper) {
      imageWrapper.classList.add("image-is-missing");
    }
  });
});

const soundCapsuleDemo = document.querySelector("[data-sound-demo]");

if (soundCapsuleDemo) {
  const soundRecordings = [
    {
      title: "St Patrick’s Park",
      subtitle: "Version 1 – Park Ambience",
      category: "Parks",
      description: "Natural park ambience with birds, wind and leaves.",
      audioSrc: "../assets/audio/st-patricks-park-ambience.mp3",
      duration: "05:39"
    },
    {
      title: "St Patrick’s Park",
      subtitle: "Version 2 – Cathedral Bells",
      category: "Parks",
      description: "Park ambience with cathedral bells sounding in the distance.",
      audioSrc: "../assets/audio/st-patricks-park-bells.mp3",
      duration: "12:36"
    },
    {
      title: "Smithfield Luas Stop",
      subtitle: "Transport ambience",
      category: "Transport",
      description: "Luas arrivals, announcements, footsteps and surrounding street sounds.",
      audioSrc: "../assets/audio/smithfield-luas-stop.mp3",
      duration: "09:59"
    },
    {
      title: "Drury Street",
      subtitle: "Summer Evening",
      category: "Streets",
      description: "Evening atmosphere with conversation, passing cars and city life.",
      audioSrc: "../assets/audio/drury-street-summer-evening.mp3",
      duration: "02:27"
    }
  ];

  const audio = soundCapsuleDemo.querySelector("[data-sound-audio]");
  const count = soundCapsuleDemo.querySelector("[data-sound-count]");
  const category = soundCapsuleDemo.querySelector("[data-sound-category]");
  const title = soundCapsuleDemo.querySelector("[data-sound-title]");
  const subtitle = soundCapsuleDemo.querySelector("[data-sound-subtitle]");
  const description = soundCapsuleDemo.querySelector("[data-sound-description]");
  const playButton = soundCapsuleDemo.querySelector("[data-sound-play]");
  const previousButton = soundCapsuleDemo.querySelector("[data-sound-prev]");
  const nextButton = soundCapsuleDemo.querySelector("[data-sound-next]");
  const seek = soundCapsuleDemo.querySelector("[data-sound-seek]");
  const currentTime = soundCapsuleDemo.querySelector("[data-sound-current]");
  const duration = soundCapsuleDemo.querySelector("[data-sound-duration]");
  const cards = document.querySelectorAll("[data-sound-card]");
  const locationButtons = soundCapsuleDemo.querySelectorAll("[data-sound-location]");

  let activeIndex = 0;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
      return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return String(minutes).padStart(2, "0") + ":" + String(remainingSeconds).padStart(2, "0");
  }

  function updatePlayState(isPlaying) {
    playButton.textContent = isPlaying ? "Ⅱ" : "▶";
    playButton.setAttribute("aria-label", isPlaying ? "Pause selected recording" : "Play selected recording");
    playButton.setAttribute("aria-pressed", String(isPlaying));
    playButton.classList.toggle("is-playing", isPlaying);

    cards.forEach(function (card, index) {
      const cardButton = card.querySelector("[data-sound-card-play]");
      const cardIsActive = index === activeIndex;

      if (cardButton) {
        cardButton.textContent = cardIsActive && isPlaying ? "Ⅱ" : "▶";
        cardButton.classList.toggle("is-playing", cardIsActive && isPlaying);
      }
    });
  }

  function renderRecording(index) {
    const recording = soundRecordings[index];

    activeIndex = index;
    count.textContent = index + 1 + " of " + soundRecordings.length;
    category.textContent = recording.category;
    title.textContent = recording.title;
    subtitle.textContent = recording.subtitle;
    description.textContent = recording.description;
    duration.textContent = recording.duration;
    currentTime.textContent = "00:00";
    seek.value = 0;
    seek.style.setProperty("--seek-progress", "0%");
    audio.src = recording.audioSrc;
    audio.load();

    cards.forEach(function (card, cardIndex) {
      card.classList.toggle("is-active", cardIndex === activeIndex);
    });

    locationButtons.forEach(function (button, buttonIndex) {
      button.classList.toggle("is-active", buttonIndex === activeIndex);
    });

    updatePlayState(false);
  }

  function selectRecording(index, shouldPlay) {
    const nextIndex = (index + soundRecordings.length) % soundRecordings.length;

    audio.pause();
    renderRecording(nextIndex);

    if (shouldPlay) {
      playActiveRecording();
    }
  }

  function playActiveRecording() {
    audio.play().catch(function () {
      updatePlayState(false);
    });
  }

  playButton.addEventListener("click", function () {
    if (audio.paused) {
      playActiveRecording();
    } else {
      audio.pause();
    }
  });

  previousButton.addEventListener("click", function () {
    const shouldContinuePlaying = !audio.paused;

    selectRecording(activeIndex - 1, shouldContinuePlaying);
  });

  nextButton.addEventListener("click", function () {
    const shouldContinuePlaying = !audio.paused;

    selectRecording(activeIndex + 1, shouldContinuePlaying);
  });

  locationButtons.forEach(function (button, index) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      button.blur();
      selectRecording(index, false);
    });
  });

  cards.forEach(function (card, index) {
    const cardButton = card.querySelector("[data-sound-card-play]");

    if (cardButton) {
      cardButton.addEventListener("click", function () {
        selectRecording(index, true);
      });
    }
  });

  audio.addEventListener("play", function () {
    updatePlayState(true);
  });

  audio.addEventListener("pause", function () {
    updatePlayState(false);
  });

  audio.addEventListener("ended", function () {
    updatePlayState(false);
    seek.value = 0;
    seek.style.setProperty("--seek-progress", "0%");
    currentTime.textContent = "00:00";
  });

  audio.addEventListener("loadedmetadata", function () {
    if (Number.isFinite(audio.duration)) {
      seek.max = audio.duration;
      duration.textContent = formatTime(audio.duration);
    }
  });

  seek.addEventListener("input", function () {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = Number(seek.value);
    }
  });

  audio.addEventListener("timeupdate", function () {
    const percentage = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;

    seek.value = audio.currentTime;
    seek.style.setProperty("--seek-progress", percentage + "%");
    currentTime.textContent = formatTime(audio.currentTime);
  });

  renderRecording(0);
}