// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useCurrentAccount } from '@mysten/dapp-kit';
import classNames from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loading } from '../components/Base/Loading';
import type { OwnedObjectType } from '../components/Inventory/OwnedObjects';
import { useKiosk, useOwnedKiosk } from '../hooks/kiosk';
import { useCreateKioskMutation, usePurchaseItemMutation } from '../mutations/kiosk';
import { formatSui, mistToSui } from '../utils/utils';

import './SingleKiosk.css';

const PLAN_DEFINITIONS = [
	{
		key: 'gold',
		title: 'Gold coverage',
		priceLabel: '$39',
		priceSuffix: '/month',
		tagline: 'For households who want quick top-ups during moderate dry spells.',
		features: [
			'Triggers when rainfall drops 25% below the local average',
			'Instant 600 $ relief transfer per trigger',
			'Water delivery and garden refresh stipend',
			'Live drought alerts via SMS and email',
		],
	},
	{
		key: 'platinum',
		title: 'Platinum coverage',
		priceLabel: '$69',
		priceSuffix: '/month',
		tagline: 'The resilient choice for families nurturing lawns and veggie patches.',
		features: [
			'Triggers when rainfall drops 35% below the local average',
			'Instant 1,200 $ relief transfer per trigger',
			'Includes tank cleaning & greywater filtration stipend',
			'Dedicated climate concierge for adjustments',
		],
		badge: 'Most popular',
		featured: true,
	},
	{
		key: 'diamond',
		title: 'Diamond coverage',
		priceLabel: '$109',
		priceSuffix: '/month',
		tagline: 'Tailored for hobby farms and lifestyle properties needing high ceilings.',
		features: [
			'Custom trigger thresholds with seasonal tuning',
			'Up to 2,500 $ relief transfer per trigger',
			'Includes soil moisture sensor bundle',
			'Priority access to resilience consultants',
		],
	},
] as const;

type PlanKey = (typeof PLAN_DEFINITIONS)[number]['key'];

type PlanView = (typeof PLAN_DEFINITIONS)[number] & {
	item?: OwnedObjectType;
	listingPrice?: string | null;
};

type PlanMessage = {
	text: string;
	tone: 'info' | 'error' | 'success';
};

function findMatchingItem(items: OwnedObjectType[], identifier: string) {
	const lookup = identifier.toLowerCase();
	return items.find((item) => {
		const label = item.display?.name?.toLowerCase() || '';
		return label.includes(lookup);
	});
}

function getPriceLabel(listingPrice?: string | null, fallback?: string, suffix?: string) {
	if (!listingPrice) return `${fallback || ''} ${suffix || ''}`.trim();
	return `${listingPrice} SUI`;
}

export default function SingleKiosk() {
	const { id } = useParams();
	const kioskId = id || '';

	const currentAccount = useCurrentAccount();

	const { data: kioskData, isPending, isError } = useKiosk(kioskId);
	const { data: ownedKiosk } = useOwnedKiosk(currentAccount?.address);

	const [activePlan, setActivePlan] = useState<PlanKey | null>(null);
	const [planMessages, setPlanMessages] = useState<Record<string, PlanMessage>>({});

	const purchaseMutation = usePurchaseItemMutation({});
	const createKioskMutation = useCreateKioskMutation({
		onSuccess: () => {
			setPlanMessages((prev) => ({
				...prev,
				global: { text: 'Kiosk created! Try purchasing again.', tone: 'success' },
			}));
		},
	});

	const plans = useMemo<PlanView[]>(() => {
		const items = kioskData?.items || [];
		const listings = kioskData?.listings || {};

		return PLAN_DEFINITIONS.map((plan) => {
			const match = findMatchingItem(items, plan.key);
			const listing = match ? listings[match.objectId] : null;
			const enrichedItem = match && listing ? { ...match, listing } : match;
			const listingPrice = listing?.price ? formatSui(mistToSui(listing.price)) : null;

			return {
				...plan,
				item: enrichedItem,
				listingPrice,
			};
		});
	}, [kioskData]);

	useEffect(() => {
		if (activePlan || plans.length === 0) return;
		const featured = plans.find((plan) => plan.featured);
		setActivePlan((featured?.key || plans[0]?.key) ?? null);
	}, [activePlan, plans]);

	const hasWallet = !!currentAccount?.address;
	const hasKiosk = !!ownedKiosk?.kioskId && !!ownedKiosk?.kioskCap;

	const isPurchasing = (objectId?: string) => {
		const pendingItem = purchaseMutation.variables?.item?.objectId;
		return purchaseMutation.isPending && pendingItem === objectId;
	};

	const handlePurchase = (plan: PlanView) => {
		if (!plan.item || !plan.item.listing || !kioskId) return;

		purchaseMutation.mutate(
			{
				item: {
					...plan.item,
					listing: plan.item.listing,
				},
				kioskId,
			},
			{
				onSuccess: () => {
					setPlanMessages((prev) => ({
						...prev,
						[plan.key]: { text: 'Purchase confirmed! Check your kiosk inventory.', tone: 'success' },
					}));
				},
				onError: (error: Error) => {
					setPlanMessages((prev) => ({
						...prev,
						[plan.key]: {
							text: error?.message || 'Something went wrong while processing the payment.',
							tone: 'error',
						},
					}));
				},
			},
		);
	};

	const handleCreateKiosk = () => {
		createKioskMutation.mutate(undefined, {
			onError: (error: Error) => {
				setPlanMessages((prev) => ({
					...prev,
					global: {
						text: error?.message || 'Unable to create a kiosk right now.',
						tone: 'error',
					},
				}));
			},
		});
	};

	const renderLoading = () => (
		<div className="suinsure-kiosk-page">
			<div className="suinsure-kiosk-background" aria-hidden="true"></div>
			<div className="suinsure-kiosk-loading">
				<Loading />
			</div>
		</div>
	);

	if (isPending) return renderLoading();

	if (isError) {
		return (
			<div className="suinsure-kiosk-page">
				<div className="suinsure-kiosk-background" aria-hidden="true"></div>
				<div className="suinsure-kiosk-loading">
					<p className="suinsure-kiosk-error">We could not load this kiosk. Please try again later.</p>
				</div>
			</div>
		);
	}

	const globalMessage = planMessages.global;

	return (
		<div className="suinsure-kiosk-page">
			<div className="suinsure-kiosk-background" aria-hidden="true"></div>
			<div className="suinsure-kiosk-overlay" aria-hidden="true"></div>
			<div className="suinsure-kiosk-container">
				<section className="suinsure-kiosk-hero" aria-labelledby="suinsure-hero-title">
					<div className="suinsure-kiosk-breadcrumbs" aria-label="Breadcrumb">
						<span>Suinsure</span>
						<span aria-hidden="true">›</span>
						<span>Parametric drought protection</span>
					</div>
					<h1 id="suinsure-hero-title">Pick your drought protection</h1>
					<p className="suinsure-kiosk-tagline">
						Transparent triggers, real-time payouts. Choose the relief tier that matches your risk comfort and pay securely
						via Sui Kiosk.
					</p>
					{globalMessage && (
						<p
							className={classNames('suinsure-kiosk-global', {
								'suinsure-kiosk-global--error': globalMessage.tone === 'error',
								'suinsure-kiosk-global--success': globalMessage.tone === 'success',
						})}
						>
							{globalMessage.text}
						</p>
					)}
				</section>

				<section className="suinsure-plan-section" aria-label="Coverage plans">
					<div className="suinsure-plan-grid">
						{plans.map((plan) => {
							const isActive = activePlan === plan.key;
							const unavailable = !plan.item;
							const message = planMessages[plan.key];

							let derivedMessage: PlanMessage | undefined = message;

							if (!derivedMessage) {
								if (unavailable) {
									derivedMessage = {
										text: 'This offer is currently unavailable.',
										tone: 'error',
									};
								} else if (!hasWallet) {
									derivedMessage = {
										text: 'Connect your wallet to continue.',
										tone: 'info',
									};
								} else if (!hasKiosk) {
									derivedMessage = {
										text: 'Create your kiosk to enable purchases.',
										tone: 'info',
									};
								}
							}

							const priceDisplay = getPriceLabel(plan.listingPrice, plan.priceLabel, plan.priceSuffix);
							const [priceAmount, priceSuffix] = priceDisplay.split(' ');
							const isProcessing = isPurchasing(plan.item?.objectId);
							const canPurchase =
								!!plan.item && !!plan.item.listing && hasWallet && hasKiosk && !isProcessing;

							return (
								<article
									key={plan.key}
									className={classNames('suinsure-plan-card', {
										'is-featured': plan.featured,
										'is-active': isActive,
										'is-unavailable': unavailable,
									})}
									onMouseEnter={() => setActivePlan(plan.key)}
									onFocus={() => setActivePlan(plan.key)}
									role="listitem"
								>
									<header className="suinsure-plan-header">
										<div>
											<p className="suinsure-plan-tier">{plan.title}</p>
											<p className="suinsure-plan-price">
												<span className="suinsure-plan-price-amount">{priceAmount}</span>
												{priceSuffix && (
													<span className="suinsure-plan-price-suffix"> {priceSuffix}</span>
												)}
											</p>
										</div>
										{plan.badge && <span className="suinsure-plan-badge">{plan.badge}</span>}
									</header>
									<p className="suinsure-plan-tagline">{plan.tagline}</p>
									<ul className="suinsure-plan-features">
										{plan.features.map((feature) => (
											<li key={feature}>{feature}</li>
										))}
									</ul>

									<div className="suinsure-plan-actions">
										<button
											type="button"
											className="suinsure-plan-cta"
											disabled={!canPurchase}
											data-loading={isProcessing ? 'true' : undefined}
											onClick={() => handlePurchase(plan)}
										>
											Payer maintenant
										</button>

										{hasWallet && !hasKiosk && plan.item && (
											<button
												type="button"
												className="suinsure-create-button"
												data-loading={createKioskMutation.isPending ? 'true' : undefined}
												onClick={handleCreateKiosk}
											>
												Créer un kiosk
											</button>
										)}
									</div>

									{derivedMessage?.text && (
										<p
											className={classNames('suinsure-plan-feedback', {
												'has-error': derivedMessage.tone === 'error',
												'has-success': derivedMessage.tone === 'success',
											})}
										>
											{derivedMessage.text}
										</p>
									)}
								</article>
							);
						})}
					</div>
				</section>
			</div>
		</div>
	);
}
