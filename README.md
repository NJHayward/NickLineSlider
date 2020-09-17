# NickLineSlider
Easy to use animated underline for horizontal navigation bars

# Usage

```html
<ul id="sampleNavBar">
    <li><a href="#" class="nickLineSliderCurrent">Home</a></li>
    <li><a href="#">News</a></li>
    <li><a href="#">Contact</a></li>
    <li><a href="#">About</a></li>
</ul>
```

```jsx
$(document).ready(function () {
    /* configure first slider */
    $("#sampleNavBar").nickLineSlider({
        HRTopMargin: "0",
        Color: "#BB0F0F",
        ChangeColorOnCurrent: true,
        ChangeColorOnHover: false,
        PercentageExtraWidth: 20,
        AppearWidth: 410,
        LoadDelay: 0,
        DoFadeIn: true
    });
});
```

# Config Options

| option | type | default | description |
| --- | --- | --- | --- |
|HRTopMargin|string|0px|Size of the top margin of the sliding line.  Can be used to move the sliding line closer or further away from the navigation links|
|Color|string|inherit|The color of the sliding line|
|ChangeColorOnCurrent|bool|true|true/false to change the color of the navigation link when that item is set as the current page with the nickLineSliderCurrent class|
|ChangeColorOnHover|bool|false|true/false to change the color of the navigation link when hovering the mouse over it|
|PercentageExtraWidth|int|20|The percentage of the extra width of the sliding line in comparison to the navigation link it belongs to.  the larger the percentage the larger the sliding line will be|
|AppearWidth|int|0|what width of screen should the line slider show/hide.  Can be used to hide the controll when swapping to mobile view|
|LoadDelay|int|0|ms delay to load the sliding line.|
|DoFadeIn|bool|true|true/false to fade the initial line slider in or have it imediatly appear|
