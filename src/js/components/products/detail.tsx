import { sortBy } from 'lodash';
import * as React from 'react';
import DocumentTitle from 'react-document-title';
import { Trans } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link, Redirect } from 'react-router-dom';

import BodyContainer from '@/components/bodyContainer';
import Header from '@/components/header';
import PlanCard from '@/components/plans/card';
import PageHeader from '@/components/products/header';
import ProductNotAllowed from '@/components/products/notAllowed';
import OldVersionWarning from '@/components/products/oldVersionWarning';
import ProductNotFound from '@/components/products/product404';
import VersionNotFound from '@/components/products/version404';
import { getLoadingOrNotFound, shouldFetchVersion } from '@/components/utils';
import { AppState } from '@/store';
import { Plan } from '@/store/plans/reducer';
import {
  fetchAdditionalPlans,
  fetchPlan,
  fetchProduct,
  fetchVersion,
} from '@/store/products/actions';
import {
  selectProduct,
  selectProductSlug,
  selectVersion,
  selectVersionLabelOrPlanSlug,
} from '@/store/products/selectors';
import { selectUserState } from '@/store/user/selectors';
import routes from '@/utils/routes';

const selectProductDetail = (
  appState: AppState,
  props: RouteComponentProps,
) => ({
  product: selectProduct(appState, props),
  productSlug: selectProductSlug(appState, props),
});

const selectVersionDetail = (
  appState: AppState,
  props: RouteComponentProps,
) => ({
  user: selectUserState(appState),
  product: selectProduct(appState, props),
  productSlug: selectProductSlug(appState, props),
  version: selectVersion(appState, props),
  versionLabelAndPlanSlug: selectVersionLabelOrPlanSlug(appState, props),
});

const productActions = {
  doFetchProduct: fetchProduct,
};

const versionActions = {
  doFetchProduct: fetchProduct,
  doFetchVersion: fetchVersion,
  doFetchAdditionalPlans: fetchAdditionalPlans,
  doFetchPlan: fetchPlan,
};

const productConnector = connect(selectProductDetail, productActions);
const versionConnector = connect(selectVersionDetail, versionActions);

type ProductPropsFromRedux = ConnectedProps<typeof productConnector>;
type VersionPropsFromRedux = ConnectedProps<typeof versionConnector>;

type ProductDetailProps = ProductPropsFromRedux;
type VersionDetailProps = VersionPropsFromRedux & RouteComponentProps;

class ProductDetail extends React.Component<ProductDetailProps> {
  fetchProductIfMissing() {
    const { product, productSlug, doFetchProduct } = this.props;
    if (product === undefined && productSlug) {
      // Fetch product from API
      doFetchProduct({ slug: productSlug });
    }
  }

  componentDidMount() {
    this.fetchProductIfMissing();
  }

  componentDidUpdate(prevProps: ProductDetailProps) {
    const { product, productSlug } = this.props;
    const productChanged =
      product !== prevProps.product || productSlug !== prevProps.productSlug;
    if (productChanged) {
      this.fetchProductIfMissing();
    }
  }

  render() {
    const { product, productSlug } = this.props;
    const loadingOrNotFound = getLoadingOrNotFound({
      product,
      productSlug,
      route: 'product_detail',
    });
    if (loadingOrNotFound !== false) {
      return loadingOrNotFound;
    }
    // This redundant check is required to satisfy Flow:
    // https://flow.org/en/docs/lang/refinements/#toc-refinement-invalidations

    /* istanbul ignore if */
    if (!product) {
      return <ProductNotFound />;
    }
    if (!product.most_recent_version) {
      return <VersionNotFound product={product} />;
    }
    const version = product.most_recent_version;
    return <Redirect to={routes.version_detail(product.slug, version.label)} />;
  }
}
class VersionDetail extends React.Component<VersionDetailProps> {
  fetchProductIfMissing() {
    const { product, productSlug, doFetchProduct } = this.props;
    if (product === undefined && productSlug) {
      // Fetch product from API
      doFetchProduct({ slug: productSlug });
    }
  }

  fetchVersionIfMissing() {
    const {
      product,
      version,
      versionLabelAndPlanSlug,
      doFetchVersion,
    } = this.props;
    const { label, slug } = versionLabelAndPlanSlug;
    // If we have a plan slug, do not try to fetch version
    // (redirect to plan-detail instead)
    if (
      product &&
      label &&
      !slug &&
      shouldFetchVersion({ product, version, versionLabel: label })
    ) {
      // Fetch version from API
      doFetchVersion({ product: product.id, label });
    }
  }

  fetchAdditionalPlansIfMissing() {
    const { product, version, doFetchAdditionalPlans } = this.props;
    if (product && version && !version.fetched_additional_plans) {
      // Fetch plans from API
      doFetchAdditionalPlans({ product: product.id, version: version.id });
    }
  }

  fetchPlanIfMissing() {
    const { product, versionLabelAndPlanSlug, doFetchPlan } = this.props;
    const { maybeVersion, maybeSlug } = versionLabelAndPlanSlug;
    if (product && maybeVersion && maybeSlug) {
      // Fetch plan from API
      doFetchPlan({
        product: product.id,
        version: maybeVersion,
        slug: maybeSlug,
      });
    }
  }

  componentDidMount() {
    this.fetchProductIfMissing();
    this.fetchVersionIfMissing();
    this.fetchAdditionalPlansIfMissing();
    this.fetchPlanIfMissing();
  }

  componentDidUpdate(prevProps: VersionDetailProps) {
    const {
      product,
      productSlug,
      version,
      versionLabelAndPlanSlug,
    } = this.props;
    const { label, slug, maybeVersion, maybeSlug } = versionLabelAndPlanSlug;
    const productChanged =
      product !== prevProps.product || productSlug !== prevProps.productSlug;
    const versionChanged =
      productChanged ||
      version !== prevProps.version ||
      label !== prevProps.versionLabelAndPlanSlug.label ||
      slug !== prevProps.versionLabelAndPlanSlug.slug ||
      maybeVersion !== prevProps.versionLabelAndPlanSlug.maybeVersion ||
      maybeSlug !== prevProps.versionLabelAndPlanSlug.maybeSlug;
    if (productChanged) {
      this.fetchProductIfMissing();
    }
    if (versionChanged) {
      this.fetchVersionIfMissing();
      this.fetchAdditionalPlansIfMissing();
      this.fetchPlanIfMissing();
    }
  }

  render() {
    const {
      user,
      product,
      productSlug,
      version,
      versionLabelAndPlanSlug,
      history,
    } = this.props;
    const { label, slug, maybeVersion, maybeSlug } = versionLabelAndPlanSlug;
    const loadingOrNotFound = getLoadingOrNotFound({
      product,
      productSlug,
      version,
      versionLabel: label,
      planSlug: slug,
      route: 'version_detail',
      maybeVersion,
      maybeSlug,
    });
    if (loadingOrNotFound !== false) {
      return loadingOrNotFound;
    }
    // this redundant check is required to satisfy Flow:
    // https://flow.org/en/docs/lang/refinements/#toc-refinement-invalidations

    /* istanbul ignore if */
    if (!product || !version) {
      return <ProductNotFound />;
    }

    const listedAdditionalPlans: Plan[] = version.additional_plans
      ? (Object.entries(version.additional_plans) as any)
          .filter(
            ([key, plan]: [string, Plan | null]) =>
              plan?.is_listed && plan?.is_allowed && key === plan?.slug,
          )
          .map((item: [string, Plan][]) => item[1])
      : [];
    const additionalPlansSorted = sortBy(listedAdditionalPlans, ['order_key']);
    const { primary_plan, secondary_plan } = version;
    const visiblePrimaryPlan =
      primary_plan?.is_listed && primary_plan?.is_allowed;
    const visibleSecondaryPlan =
      secondary_plan?.is_listed && secondary_plan?.is_allowed;
    const isMostRecent =
      product.most_recent_version &&
      new Date(version.created_at) >=
        new Date(product.most_recent_version.created_at);

    return (
      <DocumentTitle title={`${product.title} | ${window.SITE_NAME}`}>
        <>
          <Header history={history} />
          <PageHeader product={product} versionLabel={version.label} />
          {product.is_allowed ? (
            <BodyContainer>
              {product.most_recent_version && !isMostRecent ? (
                <OldVersionWarning
                  link={routes.version_detail(
                    product.slug,
                    product.most_recent_version.label,
                  )}
                />
              ) : null}
              <div
                className="slds-text-longform
      slds-p-around_medium
      slds-size_3-of-4"
              >
                {product.image ? (
                  <img
                    className="slds-size_full"
                    src={product.image}
                    alt={product.title}
                  />
                ) : null}
                {/* This description is pre-cleaned by the API */}
                {product.description && (
                  <div
                    className="markdown"
                    dangerouslySetInnerHTML={{
                      __html: product.description,
                    }}
                  />
                )}
              </div>
              <div className="slds-size_1-of-4"></div>
              {primary_plan && visiblePrimaryPlan ? (
                <div className=" slds-text-longform slds-medium-size_1-of-3 slds-small-size_1-of-2 slds-size_1-of-1">
                  <PlanCard
                    title={primary_plan.title}
                    details={primary_plan.preflight_message}
                    detailUrl={routes.plan_detail(
                      product.slug,
                      version.label,
                      primary_plan.slug,
                    )}
                  />
                </div>
              ) : null}
              {secondary_plan && visibleSecondaryPlan ? (
                <div className=" slds-text-longform slds-medium-size_1-of-3 slds-small-size_1-of-2 slds-size_1-of-1">
                  <PlanCard
                    title={secondary_plan.title}
                    details={secondary_plan.preflight_message}
                    detailUrl={routes.plan_detail(
                      product.slug,
                      version.label,
                      secondary_plan.slug,
                    )}
                  />
                </div>
              ) : null}
              {additionalPlansSorted.length ? (
                <>
                  {additionalPlansSorted.map((plan) => (
                    <div
                      key={plan.id}
                      className="slds-text-longform slds-medium-size_1-of-3 slds-small-size_1-of-2 slds-size_1-of-1"
                    >
                      <PlanCard
                        title={plan.title}
                        details={plan.preflight_message}
                        detailUrl={routes.plan_detail(
                          product.slug,
                          version.label,
                          plan.slug,
                        )}
                      />
                    </div>
                  ))}
                </>
              ) : null}
            </BodyContainer>
          ) : (
            <ProductNotAllowed
              isLoggedIn={user !== null}
              message={product.not_allowed_instructions}
              link={
                <Trans i18nKey="productNotAllowed">
                  Try the{' '}
                  <Link to={routes.product_list()}>list of all products</Link>
                </Trans>
              }
            />
          )}
        </>
      </DocumentTitle>
    );
  }
}

const WrappedProductDetail = productConnector(ProductDetail);
const WrappedVersionDetail = versionConnector(withRouter(VersionDetail));

export {
  WrappedProductDetail as ProductDetail,
  WrappedVersionDetail as VersionDetail,
};
