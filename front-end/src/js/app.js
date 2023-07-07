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
$('#image-container').on('click','svg',(eventData)=>{

    let imageUrl = $(eventData.target).parents('.image').css('background-image').replace('url("', '').replace('")', '');
    let fileName = imageUrl.replace(REST_API_URL,"").replace("/","");
   
    saveAs(imageUrl, fileName);

});

dropZone.on('dragover',(event)=>{
    event.preventDefault();
});
dropZone.on('drop',(event)=>{

    event.preventDefault();
    const droppedFiles = event.originalEvent
    .dataTransfer.files;

    let imageFiles = Array.from(droppedFiles).filter(file=>file.type.startsWith("image/"));
    if (!imageFiles.length) return;
    overlay.addClass("d-none");
    let cloneImageFiles = imageFiles.slice();
    imageFiles.forEach(image=>{

        cloudImageList.forEach(cloudImage=> {
            if (image.name == cloudImage.replace(REST_API_URL, "").replace("/", "")) {
                alert(`Image name ${image.name} is already exist`);
                cloneImageFiles=cloneImageFiles.filter(image=> image.name != cloudImage.replace(REST_API_URL, "").replace("/", ""));
            }
        });

    });
    imageFiles=cloneImageFiles;
    if(!imageFiles.length) return;

    dropSvg.removeClass('animate__fadeInUp')
    dropSvg.addClass('animate__bounceOutUp animate__slow');
    setTimeout(overlay.addClass('d-none'),2000)
    dropSvg.removeClass('animate__bounceOutUp animate__slow');
    dropSvg.addClass('animate__fadeInUp');
    uploadImages(imageFiles);

});
overlay.on('drop',(event)=>{
    event.preventDefault();
});
overlay.on('dragover',(event)=>{
    event.preventDefault();
})

function uploadImages(imageFiles) {
    const formData=new FormData();
    imageFiles.forEach(imageFile=>{
        let divElm = $('<div class="image loader"></div>');
        divElm.append(cssLoaderHtml);
        $('#image-container').append(divElm);
        formData.append("images",imageFile);
    });
    let jqxhr = $.ajax(`${REST_API_URL}`,{
        method:"POST",
        data:formData,
        contentType:false,
        processData:false
    });
    jqxhr.done((imageUrlList) => {
        cloudImageList=imageUrlList;
        imageUrlList.forEach(url =>{
            let divElm = $('.image.loader').first();
            divElm.css('background-image', `url('${url}')`);
            divElm.empty();

            divElm.removeClass('loader');
        });
    });
    jqxhr.fail(() => {

    });
    jqxhr.always(() => {
        $('.image.loader').remove();
    });
}

$('#image-container').on('click','.image',(event)=>{
    event.target.requestFullscreen();

});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
        direction: 'top'
    });
});

