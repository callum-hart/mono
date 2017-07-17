*Complements or merges with the post "the default architecture of CSS is broken."*

Overrides are the default architecture of CSS but there is no system in place to control there usage and effects. A style can be overriden by anyone from anywhere. Uncontrolled overrides yield a fragile and unpredicatble backbone for CSS.

There is no guarentie an override will take effect, because external factors determine whether it will work or not. They are relient on cascade, specificty, importance and changes to them can alter which override wins. Overrides are so vulnerable - similar to house of cards. 

Another problem with the current overriding system (or lack of) in CSS is the self-perpetuating nature of it. **The more overrides exist the more overriding you do**. The language overtly encourages this - even from a clean slate browser defaults are overriden. Variation & reusability are normally achieved by overriding unwanted styles. A developer has little option but to override.