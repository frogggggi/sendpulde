var t = 1;

var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myObj = JSON.parse(this.responseText);

        storyTitle = myObj.stories[0].croatia[0].storyTitle;
        pageTitle = myObj.stories[0].croatia[0].pageTitle;
    }
};


$('.input-group-prepend').on('click', function() {
    $('.search-input').toggleClass('show');
    $('.search-input').focus();
});
