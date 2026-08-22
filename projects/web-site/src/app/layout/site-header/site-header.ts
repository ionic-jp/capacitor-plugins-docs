import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NAV_LINKS } from '../../site-config';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SiteHeader {
  protected readonly navLinks = NAV_LINKS;
}
