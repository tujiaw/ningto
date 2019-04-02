'use strict'

const unSelectClass = "glyphicon-star-empty";
const selectClass = "glyphicon-star";
function onTagClick(self) {
    const spanObj = $(self).find('span');
    let isAdd = ($(self).html().indexOf(unSelectClass) >= 0);
    spanObj.removeClass(unSelectClass);
    spanObj.removeClass(selectClass);
    spanObj.addClass(isAdd ? selectClass : unSelectClass);

    const tagname = $(self).text().trim();
    let tags = $('#tags').val().split(';');
    if (isAdd) {
        tags.push(tagname);
    } else {
        for (let i = 0; i < tags.length; i++) {
            if (tags[i] == tagname) {
                tags.splice(i, 1);
                break;
            }
        }
    }
    $('#tags').val(tags.join(';'));
    console.log($('#tags').val());
}

$(document).ready(function() {
    const tags = $('#tags').val().split(';');
    $('.tag-cloud button').each((i, ele) => {
        var tagname = $(ele).text().trim();
        if ($.inArray(tagname, tags) >= 0) {
            $(ele).find('span').removeClass(unSelectClass);
            $(ele).find('span').addClass(selectClass);
        }
    })

    $('.type-menu a').click(function(ele) {
        $('#select_type').html(ele.target.innerText);
        $('#type').val(ele.target.innerText);
    })
})



