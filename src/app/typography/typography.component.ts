import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'sbb-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent {

  @ViewChildren('pageLink') pageLinks: QueryList<ElementRef>;

  private editorOptionsBase = {
    theme: 'vs-dark',
    codeLens: false,
    readOnly: true,
    lineNumbers: 'off',
    minimap: { enabled: false }
  };

  editorOptionsHtml = Object.assign({}, this.editorOptionsBase, { language: 'html' });

  editorOptionsScss = Object.assign({}, this.editorOptionsBase, { language: 'scss' });

  constructor(private _sanitizer: DomSanitizer) { }

  codeGlobal = `
$sizeFontBase: 15px;
$sizeLineHeightBase: 1.7;

/**
 * Font Families
 */
$fontFamilyBase: 'Helvetica Neue', Helvetica, Arial, sans-serif;
$fontSbbRoman: 'SBBWeb Roman', $fontFamilyBase;
$fontSbbBold: 'SBBWeb Bold', $fontFamilyBase;
$fontSbbUltralight: 'SBBWeb Ultralight', $fontFamilyBase;
$fontSbbLight: 'SBBWeb Light', $fontFamilyBase;
$fontSbbThin: 'SBBWeb Thin', $fontFamilyBase;

$colorWhite: #FFFFFF;
$colorBlack: #000000;

$colorBg: $colorWhite;
$colorText: $colorBlack;

html {
  background: $colorBg;
  color: $colorText;
  font-family: $fontSbbRoman;
  font-size: $sizeFontBase / 16px * 100%;
  line-height: $sizeLineHeightBase;

  @include fontSmoothing;

  b,
  strong,
  optgroup[label="*"] {
    font-family: $fontSbbBold;
    font-weight: normal;
  }
}

a {
  @include standardLink;
}

.visuallyhidden {
  @include visuallyhidden;
}

.clearfix {
  @include clearfix;
}
`;

  codeUnorderedList = `
<ul>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum
    sed.
  </li>
  <li>
    Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur
    ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl,
    bibendum cursus felis.
  </li>
</ul>`;

  codeNestedUnorderedList = `
<ul>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
    <ul>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
          Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ul>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
          </li>
        </ul>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
          Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
          Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ul>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
          </li>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
          </li>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
          </li>
        </ul>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
          Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ul>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.
  </li>
</ul>`;

  codeOrderedList = `
<ol>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
  </li>
  <li>
    Curabitur vitae vehicula sem. Praesent et convallis augue.
      Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.
  </li>
</ol>`;

  codeNestedOrderedList = `
<ol>
  <li>
    Consectetur adipiscing elit. Mauris ac velit turpis. Integer vehicula sagittis libero, id pretium metus rutrum sed.
    <ol>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
         Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
        <ol>
          <li>
            Curabitur vitae vehicula sem. Praesent et convallis augue. Quisque tristique eleifend augue, vitae consectetur ipsum porta nec.
          </li>
        </ol>
      </li>
      <li>
        Curabitur vitae vehicula sem. Praesent et convallis augue.
         Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.
      </li>
    </ol>
  </li>
  <li>
    Sed non turpis sed metus lobortis blandit non id dui. Mauris ultrices dictum ornare. Cras sed condimentum nisl, bibendum cursus felis.
  </li>
</ol>`;

  codeMixedList = `
<ol>
  <li>Die Person mit einer Behinderung besitzt eine Begleiterkarteund einen gültigen Fahrausweis.
   Als Fahrausweis gilt (dann reist die Begleitperson gratis):
    <ul>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
    </ul>
  </li>
  <li>Die Begleitperson besitzt einen gültigen Fahrausweis.
   Als Fahrausweis gilt (dann reist die Person mit einer Behinderung und einer Begleiterkarte gratis):
    <ul>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
    </ul>
  </li>
</ol>
<ul>
  <li>Die Person mit einer Behinderung besitzt eine Begleiterkarteund einen gültigen Fahrausweis.
   Als Fahrausweis gilt (dann reist die Begleitperson gratis):
    <ol>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
    </ol>
  </li>
  <li>Die Begleitperson besitzt einen gültigen Fahrausweis.
   Als Fahrausweis gilt (dann reist die Person mit einer Behinderung und einer Begleiterkarte gratis):
    <ol>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
      <li>Curabitur vitae vehicula sem. Praesent et convallis augue.
       Quisque tristique eleifend augue, vitae consectetur ipsum porta nec. Nullam eget ex pretium, tincidunt felis ac, commodo arcu.</li>
    </ol>
  </li>
</ul>`;

  codeTable = `
<sbb-table tableLabelledBy="caption">
  <thead>
    <tr>
      <th scope="col">Unternehmen und Land *1</th>
      <th scope="col">Personenkilometer (Mio. Pkm)</th>
      <th scope="col">Nettotonnenkilometer (Mio. Ntkm)</th>
      <th scope="col">Trassenkilometer (Mio. Trkm)</th>
      <th scope="col">Personal (FTE)</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row" aria-describedby="legend_item_1">
        Langer Text im Link um zu sehen, wie dieser in der Zelle umbricht. *1
      </th>
      <td>6 907</td>
      <td>
        Langer Text im Link um zu sehen, wie dieser in der Zelle umbricht.
      </td>
      <td>Langer Text um zu sehen wie genau die Zelle umbricht</td>
      <td>24 882</td>
    </tr>
    <tr>
      <th scope="row" aria-describedby="legend_item_2">
        SZDC (CZ) *2
      </th>
      <td>-</td>
      <td>-</td>
      <td>161</td>
      <td>17 380</td>
    </tr>
    <tr>
      <th scope="row" aria-describedby="legend_item_3">
        DB AG (DE) *3
      </th>
      <td>80 805</td>
      <td>78 542</td>
      <td>1 037</td>
      <td>286 237</td>
    </tr>
    <tr>
      <th scope="row" aria-describedby="legend_item_3">
        FS (IT) *3
      </th>
      <td>37 489</td>
      <td>22 081</td>
      <td>316</td>
      <td>72 341</td>
    </tr>
    <tr>
      <th scope="row" aria-describedby="legend_item_3">
        JR (JP) *3
      </th>
      <td>244 591</td>
      <td>20 255</td>
      <td>693</td>
      <td>127 989</td>
    </tr>
    <tr>
      <th scope="row" aria-describedby="legend_item_1">
        NS (NL) *1
      </th>
      <td>16 604</td>
      <td>-</td>
      <td>-</td>
      <td>7 959</td>
    </tr>
  </tbody>
  <ng-container *sbbTableCaption>
    <ol>
      <li id="legend_item_1" tabindex="-1">
        Eisenbahnverkehrsunternehmen
      </li>
      <li id="legend_item_2" tabindex="-1">
        Eisenbahninfrastrukturbetreiberin
      </li>
      <li id="legend_item_3" tabindex="-1">
        Integriertes Bahnunternehmen/Holding
      </li>
    </ol>
    <p id="caption">Quelle: UIC-Statistik 2012.</p>
  </ng-container>
</sbb-table>`;

  codeFieldset = `
<form>
  <fieldset>
    <legend>Reise Section 1</legend>
    Some content in here...
    <fieldset>
      <legend>Reise Section 1.1</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Reise Section 1.2</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Reise Section 1.3</legend>
      Some content in here...
    </fieldset>
  </fieldset>
  <fieldset>
    <legend>Reise Section 2</legend>
    Some content in here...
    <fieldset>
      <legend>Reise Section 2.1</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Reise Section 2.2</legend>
      Some content in here...
    </fieldset>
    <fieldset>
      <legend>Reise Section 2.3</legend>
      Some content in here...
    </fieldset>
  </fieldset>
</form>`;

  codeHeadings = `
<h1>h1. SBB heading</h1>
<h2>h2. SBB heading</h2>
<h3>h3. SBB heading</h3>
<h4>h4. SBB heading</h4>

<!--// scss:

h1,
.text-headline1 {
  @include headline1;
}

h2,
.text-headline2 {
  @include headline2;
}

h3,
.text-headline3 {
  @include headline3;
}

h4,
.text-headline4 {
  @include headline4;
}

-->
`;

  getRawHTML(htmlString: string) {
    return this._sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  goToInpageLink(evt: any, pageLinkIndex: number) {
    evt.preventDefault();
    this.pageLinks.toArray()[pageLinkIndex].nativeElement.focus();
  }
}
