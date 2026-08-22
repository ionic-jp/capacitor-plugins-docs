---
title: "I Realized PageSpeed Insights Is a Tool for Screening Out Web Production Sales Pitches"
description: "Use PageSpeed Insights on a prospect's sample URL—if they cannot score above red (50), treat that as a hard filter, not a performance benchmark."
zennSlug: aaa2fd4c403df1eba4c7
emoji: "🚗"
---
![](https://static.zenn.studio/user-upload/ogfkptemkaimsc4o4lwqautsc076)

# [](#description)DESCRIPTION

-   When web production sales contact you, get a representative case URL and run PageSpeed Insights on it
-   Screen out places that keep scoring red (50 or below) no matter how many times you measure
-   I cannot recommend it for anything beyond screening

# [](#%E6%9C%AC%E6%96%87)Main Text

Google developed Lighthouse, a web app auditing system, and offers it in Google Chrome DevTools. It also provides PageSpeed Insights as a service so you can measure in a service environment.

◯ **Ligththouse**  
[https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=ja](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=ja)

◯ **PageSpeed Insights**  
[https://developers.google.com/speed/pagespeed/insights/?hl=JA](https://developers.google.com/speed/pagespeed/insights/?hl=JA)

You can measure site display from outside, but still:

-   Because the concept foregrounds "analyze source code and suggest improvements," for some reason Perfomance is scored in points, not ms (speed)
-   Only one measurement, so results swing each time (network, server response, and browser rendering all vary—naturally)
-   Raising First CPU Idle can improve the Perfomance score even if you wanted to raise FMP
-   Evaluation metrics differ by version

So people say "Lighthouse gacha," "score game," and "look at other audit items and ignore Perfomance."

I mostly use Lighthouse as "the start button for measuring Performance in DevTools with cache cleared," and I had not thought much about how to use PageSpeed Insights, the hosted service.

But then it hit me.

Not "a awkward tool where a high score does not mean fast," but "a tool for screening out production companies that cannot get a score."

So

- Hide that measurement results always vary and use it as an evaluation metric  
- For some reason communicate speed as points (you can raise the score even if it did not get faster)

uses like that are evil and should stop now and in the future, but as a tool for clients to tell

- Whether a production company can do the bare minimum

I think it works. Seriously—I hear stories about companies that look nice but charge ¥◯0,000 per month for hosting on a shared rental server, so at least around me I think I will recommend using it for screening.

Reasons a company that cannot score are fine include:

- Zero-second page transitions or interactive content slow initial display—that this tool cannot measure (Single Page Application, WebGL, etc.)  
- I mean, this is a business app

Those are common and you cannot use screening for every case, but let us use it to send away salespeople who irresponsibly say "You should have a website! Everyone has one on the net these days!!"

See you again.
