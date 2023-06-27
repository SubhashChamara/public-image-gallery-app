import {saveAs} from 'file-saver';

const overlay = $('#overlay');
const btnFileSelect = $('#btn-file-select');
const dropZone = $('#drop-zone');
const cssLoaderHtml= $('<div class="lds-facebook"><div></div><div></div><div></div></div>');
const dropSvg = $('#drop-svg');
let cloudImageList=[];


btnFileSelect.on('click',()=>{overlay.removeClass('d-none')})
btnFileSelect.on('mouseenter',()=>{
    btnFileSelect.children('svg').addClass('animate__bounceOutUp animate__infinite animate__slow');

});
btnFileSelect.on('mouseleave',()=>{
    btnFileSelect.children('svg').removeClass('animate__bounceOutUp animate__infinite animate__delay-5s')
})

const REST_API_URL="http://localhost:8080/gallery/images";
loadAllImages();
overlay.on('click',(event)=>{

    if(event.target ===overlay[0] )  overlay.addClass('d-none');
   }
);
$(document).on('keydown',(event)=>{
    if(event.key==='Escape')overlay.addClass('d-none');
});

function loadAllImages() {
    const jqxhr = $.ajax(REST_API_URL,"GET");
    jqxhr.done((imageUriList)=>{

        let i=0;
        cloudImageList=imageUriList;
        imageUriList.forEach(imageUrl=>{
            console.log(i,imageUrl);
            i++;
            const image = $('<div class="image"></div>').css('background-image',`url('${imageUrl}')`);
            const iconDownload=$(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"  class="bi bi-download icon-download" viewBox="0 0 16 16">
                            <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/>
                            </svg>`);
            image.append(iconDownload);
            $('#image-container').append(image);

        })
    });
    jqxhr.fail(()=>{});
};



