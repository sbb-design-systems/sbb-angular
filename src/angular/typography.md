# Typography

## Variants

@sbb-esta/angular provides two design variants: standard and lean.

**Standard** (default)

The standard design variant is intended for public websites (e.g. sbb.ch or similar). It uses a
large amount of whitespace and supports responsive design for mobile, tablet, desktop, 4k and 5k.
The intended usage of our components in this variant are more limited according to the design
specification at [Design System Web](https://digital.sbb.ch/en/websites).

**Lean**

Lean uses a compact design and supports responsive design for mobile, tablet and desktop.
The components are more flexible in their usage as specified at [Design System Lean Applications](https://digital.sbb.ch/en/webapps).
To activate lean design, set the css class `sbb-lean` on your `<html class="sbb-lean">` element.

If you are uncertain which library to use, we recommend you to start with lean design.

**Dark mode (lean only)**

The lean design variant is available in a light and a dark mode. The mode chosen is based on the system settings. To enforce a specific mode, you can add the `sbb-light` or `sbb-dark` class to your `<html>` element.

**Style for security-critical applications**

We also provide a styling for applications that are critical for security.
For this kind of application the red color is only allowed for error messages.

Therefore, the `sbb-off-brand-colors` style replaces red colors with blue colors for all elements
except error messages. The style is based on the `sbb-lean` variant and can be activated
by addmin the css class `sbb-off-brand-colors` to your page's `<html>` element.

```html
<html class="sbb-lean sbb-off-brand-colors"></html>
```

For viewing this documentation app in the `sbb-off-brand-colors` mode you can simply click
[this link](/?mode=sbb-off-brand-colors&variant=lean) or add the `?mode=sbb-off-brand-colors`
query parameter to any page of this documentation app.

## Global Settings

SBB Angular library sets basic global typography, display and link styles.

- Use the custom SBB Font stack. `SBBWeb Roman`, `SBBWeb Bold`, `SBBWeb Light`, `SBBWeb Thin` and `SBBWeb Ultralight`
- The html base font is a `SBBWeb Roman` size `93.75% | 15px` with a line height of `1.7`
- Default body background color is `#FFFFFF`

## Headings

HTML headings, from `h1` to `h4`.

You can also use the headings classes to make every tag looks like a heading. Available classes: `.sbb-headline1`, `.sbb-headline2`, `.sbb-headline3`, `.sbb-headline4`.

<h1>h1. SBB heading</h1>
<h2>h2. SBB heading</h2>
<h3>h3. SBB heading</h3>
<h4>h4. SBB heading</h4>

```html
<h1>h1. SBB heading</h1>
<h2>h2. SBB heading</h2>
<h3>h3. SBB heading</h3>
<h4>h4. SBB heading</h4>
```

## Lead Text

<p class="sbb-text-lead">
  Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium
  metus rutrum sed. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique
  eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac,
  commodo arcu.
</p>

```html
<p class="sbb-text-lead">
  Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium
  metus rutrum sed. Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique
  eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac,
  commodo arcu.
</p>
```

## Lists

### Unordered Lists

- Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
- Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
- Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.

```html
<ul>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id
    pretium metus rutrum sed.
  </li>
  <li>
    Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
    vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
  </li>
</ul>
```

### Nested Unordered Lists

- Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
  - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
    - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
  - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
    - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
    - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
    - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
  - Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
- Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.

```html
<ul>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id
    pretium metus rutrum sed.
    <ul>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ul>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend
            augue, vitae consectetur ipsum porta nec.
          </li>
        </ul>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ul>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend
            augue, vitae consectetur ipsum porta nec.
          </li>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend
            augue, vitae consectetur ipsum porta nec.
          </li>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend
            augue, vitae consectetur ipsum porta nec.
          </li>
        </ul>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ul>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
  </li>
</ul>
```

### Ordered Lists

<ol>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id
    pretium metus rutrum sed.
  </li>
  <li>
    Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
    vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
  </li>
</ol>

```html
<ol>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id
    pretium metus rutrum sed.
  </li>
  <li>
    Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
    vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
  </li>
</ol>
```

### Nested Ordered Lists

<ol>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id
    pretium metus rutrum sed.
    <ol>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ol>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend
            augue, vitae consectetur ipsum porta nec.
          </li>
        </ol>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ol>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
  </li>
</ol>

```html
<ol>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id
    pretium metus rutrum sed.
    <ol>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ol>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend
            augue, vitae consectetur ipsum porta nec.
          </li>
        </ol>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ol>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
  </li>
</ol>
```

### Mixed Lists

<ol>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ul>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ul>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ul>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ul>
  </li>
</ol>
<ul>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ol>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ol>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ol>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ol>
  </li>
</ul>

```html
<ol>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ul>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ul>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ul>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ul>
  </li>
</ol>
<ul>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ol>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ol>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed
    condimentum nisl, bibendum cursus felis.
    <ol>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue,
        vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ol>
  </li>
</ul>
```

## Tables

In order to apply sbb table styling you have to use the class `sbb-table`.

Don't forget to follow a couple of simple rules for the accessibility and styling. In order to have proper styles you must use the `thead` and `tbody` tags.

In order to have proper accessibility you have to mark table headings with the proper `th` tag and the `scope` attribute set to `col` for column headers and `row` for row headers.

If you have a custom caption or legend, don't forget to use proper aria-describedby and aria-labelledby association.

<table class="sbb-table">
  <thead>
    <tr>
      <th scope="col">Company and country *1</th>
      <th scope="col">Passenger-kilometers (Mio. Pkm)</th>
      <th scope="col">Tonne-kilometers (Mio. Ntkm)</th>
      <th scope="col">Route-kilometers (Mio. Trkm)</th>
      <th scope="col">Staff (FTE)</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">
        Long text in a link to see how it wraps in the cell. *1
      </th>
      <td>6 907</td>
      <td>
        Long text in a link to see how it wraps in the cell.
      </td>
      <td>Long text in a link to see how exactly the cell wraps</td>
      <td>24 882</td>
    </tr>
    <tr>
      <th scope="row">
        SZDC (CZ) *2
      </th>
      <td>-</td>
      <td>-</td>
      <td>161</td>
      <td>17 380</td>
    </tr>
    <tr>
      <th scope="row">
        DB AG (DE) *3
      </th>
      <td>80 805</td>
      <td>78 542</td>
      <td>1 037</td>
      <td>286 237</td>
    </tr>
    <tr>
      <th scope="row">
        FS (IT) *3
      </th>
      <td>37 489</td>
      <td>22 081</td>
      <td>316</td>
      <td>72 341</td>
    </tr>
    <tr>
      <th scope="row">
        JR (JP) *3
      </th>
      <td>244 591</td>
      <td>20 255</td>
      <td>693</td>
      <td>127 989</td>
    </tr>
    <tr>
      <th scope="row">
        NS (NL) *1
      </th>
      <td>16 604</td>
      <td>-</td>
      <td>-</td>
      <td>7 959</td>
    </tr>
  </tbody>
</table>

```html
<table class="sbb-table">
  <thead>
    <tr>
      <th scope="col">Company and country *1</th>
      <th scope="col">Passenger-kilometers (Mio. Pkm)</th>
      <th scope="col">Tonne-kilometers (Mio. Ntkm)</th>
      <th scope="col">Route-kilometers (Mio. Trkm)</th>
      <th scope="col">Staff (FTE)</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Long text in a link to see how it wraps in the cell. *1</th>
      <td>6 907</td>
      <td>Long text in a link to see how it wraps in the cell.</td>
      <td>Long text in a link to see how exactly the cell wraps</td>
      <td>24 882</td>
    </tr>
    <tr>
      <th scope="row">SZDC (CZ) *2</th>
      <td>-</td>
      <td>-</td>
      <td>161</td>
      <td>17 380</td>
    </tr>
    <tr>
      <th scope="row">DB AG (DE) *3</th>
      <td>80 805</td>
      <td>78 542</td>
      <td>1 037</td>
      <td>286 237</td>
    </tr>
    <tr>
      <th scope="row">FS (IT) *3</th>
      <td>37 489</td>
      <td>22 081</td>
      <td>316</td>
      <td>72 341</td>
    </tr>
    <tr>
      <th scope="row">JR (JP) *3</th>
      <td>244 591</td>
      <td>20 255</td>
      <td>693</td>
      <td>127 989</td>
    </tr>
    <tr>
      <th scope="row">NS (NL) *1</th>
      <td>16 604</td>
      <td>-</td>
      <td>-</td>
      <td>7 959</td>
    </tr>
  </tbody>
</table>
```

## Section (Fieldset)

<form>
  <fieldset>
    <legend>Journey Section 1</legend>
    Some content in here...
    <fieldset>
      <legend>Journey Section 1.1</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 1.2</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 1.3</legend>
      Some content in here...
    </fieldset>
  </fieldset>
  <fieldset>
    <legend>Journey Section 2</legend>
    Some content in here...
    <fieldset>
      <legend>Journey Section 2.1</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 2.2</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 2.3</legend>
      Some content in here...
    </fieldset>
  </fieldset>
</form>

```html
<form>
  <fieldset>
    <legend>Journey Section 1</legend>
    Some content in here...
    <fieldset>
      <legend>Journey Section 1.1</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 1.2</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 1.3</legend>
      Some content in here...
    </fieldset>
  </fieldset>
  <fieldset>
    <legend>Journey Section 2</legend>
    Some content in here...
    <fieldset>
      <legend>Journey Section 2.1</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 2.2</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Journey Section 2.3</legend>
      Some content in here...
    </fieldset>
  </fieldset>
</form>
```

## Dividers

The following divider css classes are available to define vertical space either as top, bottom or combined margin.

- .sbb-divider-thin-vertical
- .sbb-divider-thin-top
- .sbb-divider-thin-bottom
- .sbb-divider-small-vertical
- .sbb-divider-small-top
- .sbb-divider-small-bottom
- .sbb-divider-medium-vertical
- .sbb-divider-medium-top
- .sbb-divider-medium-bottom
- .sbb-divider-big-vertical
- .sbb-divider-big-top
- .sbb-divider-big-bottom

<div>Content</div>
<div class="sbb-divider-thin-top">Content with space to previous content</div>

```html
<div>Content</div>
<div class="sbb-divider-thin-top">Content with space to previous content</div>
```
