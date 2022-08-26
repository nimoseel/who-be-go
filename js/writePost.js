var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { handleUploadImage } from './imageApi.js';
import { getMovieInfo } from './movieApi.js';
import { writeReview } from './reviewApi.js';
const movieTitle = document.querySelector('#movie-title');
const movieSubTitle = document.querySelector('#movie-title-eng');
const textRating = document.querySelector('#text-rating');
const radioRating = document.querySelectorAll('.radio-rating');
const imgReview = document.querySelector('#img-review');
const imgInput = document.querySelector('#img-input');
const textReview = document.querySelector('#text-review');
const saveButton = document.querySelector('#btn-save');
const loading = document.querySelector('.wrapper-etc');
// const movieSeq = window.location.search.slice(1);
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const movieId = params.get('movieId');
const movieSeq = params.get('movieSeq');
// 서버로 전송할 이미지 (파일 정보가 담김)
let img;
const IMG_MAX_SIZE = 10 * 1024 * 1024;
let imgUrl = '';
const fileTypeArray = [
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/tiff',
    'image/heic',
];
const setTextHeight = (e) => {
    const target = e.currentTarget;
    target.style.height = textReview.scrollHeight + 'px';
    if (target.value.length > 0) {
        saveButton.classList.remove('disabled');
    }
    else {
        saveButton.classList.add('disabled');
    }
};
// 감상문 업로드
const handleUploadReview = (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    if (textRating.textContent === '') {
        alert('별점을 입력해주세요.');
        return;
    }
    if (img) {
        imgUrl = yield handleUploadImage(img);
    }
    const reqData = {
        post: {
            content: movieTitle.textContent +
                '@' +
                movieSubTitle.textContent +
                '@' +
                textRating.textContent +
                '@' +
                textReview.value,
            image: imgUrl,
        },
    };
    const postId = yield writeReview(reqData);
    window.location.href = `/pages/reviewDetail.html?id=${postId}`;
});
window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
    if (movieId !== null && movieSeq !== null) {
        const movieInfo = yield getMovieInfo(movieId, movieSeq);
        movieTitle.textContent = movieInfo.title;
        if (movieInfo.titleEng !== '') {
            movieSubTitle.textContent = movieInfo.titleEng;
        }
        else {
            movieSubTitle.textContent = movieInfo.titleOrg;
        }
        if (movieInfo.posters !== '') {
            imgUrl = movieInfo.posters.substring(0, 60);
        }
    }
    loading.classList.add('disabled');
}));
imgInput.addEventListener('change', (e) => {
    const fileReader = new FileReader();
    const target = e.currentTarget;
    const files = target.files;
    // 파일 선택 안 했을 때
    if (files === null) {
        return;
    }
    // 파일 타입이 이미지가 아닐 때
    if (!fileTypeArray.includes(files[0].type)) {
        alert('이미지 파일만 첨부 가능합니다.');
        return;
    }
    if (files[0].size > IMG_MAX_SIZE) {
        alert('10MB 미만의 이미지만 첨부 가능합니다.');
        return;
    }
    fileReader.readAsDataURL(files[0]);
    fileReader.addEventListener('load', () => {
        if (fileReader.result !== null) {
            imgReview.classList.remove('disabled');
            img = files[0];
            imgReview.src = fileReader.result.toString();
            target.value = '';
        }
    });
});
textReview.addEventListener('keydown', (e) => {
    setTextHeight(e);
});
textReview.addEventListener('keyup', (e) => {
    setTextHeight(e);
});
saveButton.addEventListener('click', (e) => {
    handleUploadReview(e);
});
for (let rating of radioRating) {
    rating.addEventListener('click', () => {
        const ratingValue = rating.value;
        textRating.textContent = ratingValue;
    });
}
