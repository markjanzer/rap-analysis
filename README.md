# [Rap Analysis WebApp](http://gentle-wildwood-3897.herokuapp.com)

Gives you the tools to transcribe rap and analyze its musical properties with a visual display and statistics to match.

## How to use Rap Analysis Webapp

To view transcriptions of songs, you do not need to create account. Visit [the site](http://gentle-wildwood-3897.herokuapp.com) and you can view public transcriptions and the song statistics. You can also play around with transcription, but nothing will be saved.

To record your transcribed songs, you have to make an account (passwords are saved with bCrypt).

When transcribing a song:
*   When choosing measures per phrase, listen to the music accompanying the rapper. Shook Ones Part 2 by Mobb Deep is an example of a 2 measure phrase, and Clear Soul Forces' "No Better" is an example of a four bar phrase (most songs are composed of four bar phrases).
*   Pickup creates measures before the official beginning of a verse. For an exaggerated example of pickup measures, see Pharoahe Monch's verse (the second verse) on "Oh no" (most pickups are only a few beats long so one measure will do).
*   For mul- ti- syl- lab- ic words, split syl- la- bles with hy- phens to clar- i- fy that they are the same word.
*   Rule of thumb: if unsure about stress, include it. If unsure about rhyme, don't include it (especially if the syllable is unstressed).
*   The process of transcription is not entirely objective! Don't worry if you are unsure, just go with your instinct.
*   If you have any questions, please contact me at mark.janzer@gmail.com! Include your username and the name of the song you are transcribing (and provide a recording if possible).

## Moving Forward

There are many features, technologies, and refactorizations that I want to implement. I'll list a few notables from each:

### Features
*   Add functionality to create songs with different subdivisions and beats per measure.
*   A page to view artists or albums
*   Render statistics for Album, Artist, Song, Section, Phrase, Year, Region, and combinations (and add a tool to compare)
*   Add a forum to the site
*   Add option to use half the number of colors and optimize for  color-blind

### Technologies
*   React for the front end (it would help notably for the edit song page)
*   Python for Data Science

### Refactorizations
*   Add more comments to code
*   Add tests
*   Redistribute routes do different controllers

## Does it work?

I can tell you that people stressed beat one from 1978 to 1987, and began avoiding it more consistently until at least the mid 90s. I can tell you that all downbeats were more consistently stressed beginning in 1984 with LL Cool J. I can tell you that consistency in the placement end rhyme grew in the mid 90s and was least consistent in the works of the Wu-Tang Clan and Notorious B.I.G. But these insights are taken from my individual analyses, and from small sample sizes. I would rather contribute with others and let the statistics show themselves.

## Why do it?

In his book "Sweet Anticipation: Music and the Psychology of Expectation", David Huron answers this question beautifully.

>   "It is essential that musicians understand that I am attempting to describe the psychological processes, not aesthetic goals. My musical aim in this book is to provide musicians with a better understanding of some of the tools they use, not to tell musicians what goals they should pursue. If we want to expand artistic horizons and foster creativity there is no better approach than improving our understanding of how minds work.

>   Many artists have assumed that such knowledge is unnecessary: it is intuition rather than knowledge that provides the foundation for artistic creation. I agree that intuition is essential for artistic production: in the absence of knowledge, our only recourse is to follow our intuitions. But intuition is not the foundation for artistic freedom or creative innovation. Quite the contrary. The more we rely on our intuitions, the more our behaviors may be dictated by unacknowledged social norms or biological predispositions. Intuition is, and has been, indispensable in the arts. But intuition needs to be supplemented by knowledge (or luck) if artists are to break through 'counterintuitive' barrier into new realms of artistic expression."

## Contact and Contribute

Thank you in advance contributions of any form, whether it be transcriptions, discussion, pull requests, or advice. I honestly appreciate any and all conversation or contributions for this project.

I also want to thank Kyle Adams (notably for the chart display of rap), David Huron, Adam Krims, Martin Connor, and many others for their contributions to the field of rap analysis.
The master branch of this is deployed on Heroku at: [http://gentle-wildwood-3897.herokuapp.com](http://gentle-wildwood-3897.herokuapp.com)

If you have any questions or comments, feel free to shoot me an email at mark.janzer@gmail.com


