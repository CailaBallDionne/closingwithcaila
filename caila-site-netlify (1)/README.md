# Closing With Caila — Site Guide
## Everything you need to update and maintain your site

---

## YOUR FILE LIST

| File | What it is |
|------|-----------|
| index.html | Home page |
| buyers.html | Buyers page |
| sellers.html | Sellers page |
| blog.html | Info Hub (blog listing) |
| faq.html | FAQ page |
| contact.html | Contact page |
| author.html | Author page (important for SEO/AEO) |
| styles.css | All design: fonts, colors, layout |
| main.js | Nav, FAQ accordion, filters, form |
| README.md | This file |
| caila-ball-dionne-la-crescenta-realtor.jpg | Hero photo |
| caila-ball-dionne-foothills-real-estate-agent.jpg | About photo |

---

## HOW TO EDIT TEXT (the only rule)

1. Open the file in TextEdit (Mac) or Notepad (PC)
2. Press Cmd+F (Mac) or Ctrl+F (PC)
3. Search for the words you want to change
4. Edit the text. Never change the tags themselves.

SAFE:
  <h1>Your next chapter starts <em>here.</em></h1>
  Change to: <h1>Let's find your perfect home.</h1>

UNSAFE (breaks the page):
  <h1 Your next chapter /h1>

Every editable section has a comment above it that starts with EDIT:
Search for "EDIT:" to jump to any section quickly.

---

## HOW TO UPDATE YOUR PHOTOS

Your photos must be named EXACTLY:
  caila-ball-dionne-la-crescenta-realtor.jpg       (hero — tall portrait)
  caila-ball-dionne-foothills-real-estate-agent.jpg (about — relaxed shot)

To swap a photo:
1. Save your new photo with the exact filename above
2. Drop it into the caila-site folder (replace the old one)
3. Re-upload the folder to Netlify
Done. No code changes needed.

---

## HOW TO ADD A BLOG POST

### Step 1 — Add the card to blog.html

Open blog.html and find the section that says:
  <!-- HUW TO ADD A NEW POST -->

Copy this entire block:

  <article class="hub-card" data-category="buyers"
    itemscope itemtype="https://schema.org/Article">
    <meta itemprop="author" content="Caila Ball-Dionne"/>
    <meta itemprop="publisher" content="Closing With Caila"/>
    <span class="hub-tag" itemprop="articleSection">Buyers</span>
    <h3 itemprop="headline">Your post title here</h3>
    <p itemprop="description">A 2-3 sentence summary of the post.</p>
    <div class="hub-card-footer">
      <span class="hub-date"><time itemprop="datePublished" datetime="2026-06-15">June 15, 2026</time></span>
      <a class="hub-read" href="https://blog.closingwithcaila.com/your-post-url" itemprop="url">Read more</a>
    </div>
  </article>

Paste it at the TOP of the hub-grid div (newest posts appear first).

Update:
  data-category    buyers / sellers / market
  hub-tag text     Buyers / Sellers / Market
  h3               Your post title
  p                Your 2-3 sentence excerpt
  datetime         The date in YYYY-MM-DD format
  visible date     The date in plain English (June 15, 2026)
  href             Your full WordPress post URL

### Step 2 — Add Article schema to blog.html

In the <script type="application/ld+json"> block in the <head> of blog.html,
you'll see the Blog schema. Each published post should also have its own
Article schema. Add this inside the @graph array:

  {
    "@type": "Article",
    "@id": "https://blog.closingwithcaila.com/your-post-url#article",
    "headline": "Your post title here",
    "description": "Your 2-3 sentence excerpt here.",
    "url": "https://blog.closingwithcaila.com/your-post-url",
    "datePublished": "2026-06-15",
    "dateModified": "2026-06-15",
    "author": {"@id": "https://closingwithcaila.com/author.html#person"},
    "publisher": {"@id": "https://closingwithcaila.com/#agent"},
    "isPartOf": {"@id": "https://closingwithcaila.com/blog.html#blog"},
    "about": {"@type": "Thing", "name": "Real estate buying"},
    "inLanguage": "en-US",
    "image": "https://closingwithcaila.com/caila-ball-dionne-la-crescenta-realtor.jpg"
  }

Separate each schema block with a comma inside the @graph array.

### Step 3 — Write and publish on WordPress

Log into WordPress.com, write your post, and hit Publish.
Copy the published URL and paste it into the href in blog.html.
Re-upload to Netlify.

---

## HOW TO ADD A FAQ QUESTION

Open faq.html and find the faq-inner div.
Copy this block:

  <div class="faq-item">
    <button class="faq-q" onclick="toggleFaq(this)">
      Your question here?
      <span class="faq-icon">+</span>
    </button>
    <div class="faq-a">
      <p>Your answer here.</p>
    </div>
  </div>

Paste it where you want it to appear.

IMPORTANT: Also add the Q&A to the FAQPage schema in the <head> of faq.html.
Find the mainEntity array and add:

  {
    "@type": "Question",
    "name": "Your question here?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Your answer here.",
      "author": {"@id": "https://closingwithcaila.com/author.html#person"}
    }
  }

This is what gets picked up by Google rich snippets and AI answer engines.

---

## HOW TO UPDATE YOUR CONTACT FORM

Your form sends to: caila@theborgesrealestateteam.com via Formspree.

Setup (one time):
1. Go to formspree.io and create a free account
2. Click New Form, name it "Closing With Caila Contact"
3. Set notification email to: caila@theborgesrealestateteam.com
4. Copy your form ID (characters after formspree.io/f/)
5. Open contact.html and find: YOUR_FORMSPREE_ID
6. Replace it with your actual ID
7. Save and re-upload to Netlify

---

## HOW TO GO LIVE / UPDATE THE LIVE SITE

Every time you make changes:
1. Save the file
2. Go to netlify.com and log in
3. Drag the entire caila-site folder onto your site's deploy box
4. Live in about 30 seconds

---

## HOW TO CONNECT YOUR GODADDY DOMAIN

1. In Squarespace: skip — you're on Netlify
2. In Netlify: Site Settings > Domain Management > Add Custom Domain
3. Type closingwithcaila.com and click Verify
4. Netlify shows you two DNS records
5. Log into GoDaddy > DNS > Manage DNS
6. Edit the @ A record: change value to Netlify's IP address
7. Add CNAME for "www": value = your Netlify subdomain (e.g. yoursite.netlify.app)
8. Save. Wait up to 1 hour.
9. Back in Netlify, enable HTTPS under Domain Management (free, one click)

---

## SCHEMA MARKUP — WHAT'S INCLUDED AND WHY

Schema markup is invisible code that tells Google and AI engines exactly
who you are, what you do, and why your content is trustworthy.

| Page | Schema type | Why it matters |
|------|-------------|----------------|
| index.html | RealEstateAgent + LocalBusiness | Local SEO, shows in Google Business-style results |
| buyers.html | Service | Tells Google what service you provide and to whom |
| sellers.html | Service | Same for sellers |
| faq.html | FAQPage | FAQ answers can appear directly in search results and AI responses |
| blog.html | Blog | Establishes the Info Hub as a content publication |
| author.html | Person | Establishes you as a verified expert author for AEO |
| contact.html | ContactPage | Helps Google understand site structure |
| All pages | BreadcrumbList + WebPage | Site structure for search indexing |

The author.html Person schema is especially important for AEO (Answer Engine
Optimization). When AI tools like ChatGPT, Perplexity, or Google's AI Overviews
answer questions about real estate in La Crescenta, they look for content from
verified, credentialed experts. Your DRE license number, brokerage affiliation,
and author entity all contribute to that trust signal.

WHEN YOU ADD A FAQ: always update both the visible HTML and the FAQPage schema.
WHEN YOU PUBLISH A POST: always add Article schema linking back to author.html.

---

## QUICK REFERENCE

Live site:          https://closingwithcaila.com
Home search:        https://caila.lametrohomefinder.com/
Instagram:          https://www.instagram.com/closingwithcaila
Borges Team:        https://www.theborgesrealestateteam.com
Netlify dashboard:  https://app.netlify.com
Formspree:          https://formspree.io
WordPress (blog):   https://wordpress.com
Google Search Console: https://search.google.com/search-console

DRE number: CA DRE #02439602
Contact email: caila@theborgesrealestateteam.com

---

Questions? Come back to Claude, paste the section you're stuck on,
and ask for the exact edit. You cannot permanently break anything
as long as you keep a backup copy of the working zip file.
