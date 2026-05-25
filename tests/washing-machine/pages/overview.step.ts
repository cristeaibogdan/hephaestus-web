import { type Locator, type Page } from '@playwright/test';

// TODO: A way to simplify?
export class OverviewStep {

  constructor(
    private page: Page
  ) {}

  getOverviewStepHeader(): Locator {
    return this.page.getByRole('heading', { name: 'Overview' });
  }

  category(): Locator {
    return this.productInformationList().filter({ hasText: 'CATEGORY:' });
  }

  manufacturer(): Locator {
    return this.productInformationList().filter({ hasText: 'MANUFACTURER:' });
  }

  serialNumber(): Locator {
    return this.productInformationList().filter({ hasText:'SERIAL NUMBER:' });
  }

  model(): Locator {
    return this.productInformationList().filter({ hasText:'MODEL:' });
  }

  type(): Locator {
    return this.productInformationList().filter({ hasText: 'TYPE:' });
  }

  identificationMode(): Locator {
    return this.identificationModeAndDamageTypeList().filter({ hasText:'IDENTIFICATION MODE:' });
  }

  returnType(): Locator {
    return this.identificationModeAndDamageTypeList().filter({ hasText:'RETURN TYPE:' });
  }

  damageType(): Locator {
    return this.identificationModeAndDamageTypeList().filter({ hasText:'DAMAGE TYPE:' });
  }

  private productInformationList(): Locator {
    return this.page.getByRole('list').first();
  }

  private identificationModeAndDamageTypeList(): Locator {
    return this.page.getByRole('list').nth(1);
  }

  // TODO: Latching on using css classes will lead to trouble
  images(): Locator {
    return this.page.locator('section.image-list img');
  }

  packageDamaged(): Locator {
    return this.packageArticle().getByRole('listitem').filter({ hasText: 'Damaged' });
  }

  packageDirty(): Locator {
    return this.packageArticle().getByRole('listitem').filter({ hasText: 'Dirty' });
  }

  packageMaterialAvailable(): Locator {
    return this.packageArticle().getByRole('listitem').filter({ hasText: 'Repackage Material Available' });
  }

  scratchesLength(): Locator {
    return this.visibleSurfacesArticle().getByRole('listitem').filter({ hasText: 'Scratches' });
  }

  private packageArticle(): Locator {
    return this.page.getByRole('article').filter({ hasText: 'Package' });
  }

  visibleSurfacesScratchesLength(): Locator {
    return this.visibleSurfacesArticle().getByRole('listitem').filter({ hasText: 'Scratches' });
  }

  visibleSurfacesDentsDepth(): Locator {
    return this.visibleSurfacesArticle().getByRole('listitem').filter({ hasText: 'Dents' });
  }

  visibleSurfacesMinorDamages(): Locator {
    return this.visibleSurfacesArticle().getByRole('listitem').filter({ hasText: 'Minor Damages' });
  }

  visibleSurfacesMajorDamages(): Locator {
    return this.visibleSurfacesArticle().getByRole('listitem').filter({ hasText: 'Major Damages' });
  }

  private visibleSurfacesArticle(): Locator {
    return this.page.getByRole('article').filter({ hasText: 'Visible Surfaces' });
  }

  hiddenSurfacesScratchesLength(): Locator {
    return this.hiddenSurfacesArticle().getByRole('listitem').filter({ hasText: 'Scratches' });
  }

  hiddenSurfacesDentsDepth(): Locator {
    return this.hiddenSurfacesArticle().getByRole('listitem').filter({ hasText: 'Dents' });
  }

  hiddenSurfacesMinorDamages(): Locator {
    return this.hiddenSurfacesArticle().getByRole('listitem').filter({ hasText: 'Minor Damages' });
  }

  hiddenSurfacesMajorDamages(): Locator {
    return this.hiddenSurfacesArticle().getByRole('listitem').filter({ hasText: 'Major Damages' });
  }

  private hiddenSurfacesArticle(): Locator {
    return this.page.getByRole('article').filter({ hasText: 'Hidden Surfaces' });
  }

  productPrice(): Locator {
    return this.pricingArticle().getByRole('listitem').filter({ hasText: 'Product Price:' });
  }

  repairPrice(): Locator {
    return this.pricingArticle().getByRole('listitem').filter({ hasText: 'Product Repair Price:' });
  }

  private pricingArticle(): Locator {
    return this.page.getByRole('article').filter({ hasText: 'Pricing' });
  }
}