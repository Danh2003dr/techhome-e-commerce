import React from 'react';
import { useParams } from 'react-router-dom';
import OrderListPage, { type OrderListInitialVariant } from './OrderListPage';

const asStringArray = (arr: string[] | undefined) => arr ?? [];

const OrderListsVariantPage: React.FC = () => {
  const { variantId } = useParams();
  const id = Number(variantId);

  const initialVariant: OrderListInitialVariant = (() => {
    switch (id) {
      // #9: Order list base (no filters)
      case 9:
        return {
          openModal: null,
          dateFilter: '14 Feb 2019',
          selectedTypes: [],
          selectedStatuses: [],
        };

      // #10: Date picker open
      case 10:
        return {
          openModal: 'date',
          dateFilter: '14 Feb 2019',
          draftDate: '14 Feb 2019',
          selectedTypes: [],
          selectedStatuses: [],
        };

      // #11: Date applied state
      case 11:
        return {
          openModal: null,
          dateFilter: '14 Feb 2019',
          selectedTypes: [],
          selectedStatuses: [],
        };

      // #12: Order type modal (default, empty selection)
      case 12:
        return {
          openModal: 'type',
          dateFilter: '14 Feb 2019',
          selectedTypes: [],
          selectedStatuses: [],
          draftTypes: [],
          draftStatuses: [],
        };

      // #13: Order type modal (selected chips)
      case 13:
        return {
          openModal: 'type',
          dateFilter: '14 Feb 2019',
          selectedTypes: asStringArray(['Health & Beauty', 'Book & Stationery', 'Services & Industry']),
          selectedStatuses: [],
          draftTypes: asStringArray(['Health & Beauty', 'Book & Stationery', 'Services & Industry']),
          draftStatuses: [],
        };

      // #14: Order status modal (default, empty selection)
      case 14:
        return {
          openModal: 'status',
          dateFilter: '14 Feb 2019',
          selectedTypes: [],
          selectedStatuses: [],
          draftStatuses: [],
          draftTypes: [],
        };

      // #15: Order status modal (selected chips)
      case 15:
        return {
          openModal: 'status',
          dateFilter: '14 Feb 2019',
          selectedTypes: [],
          selectedStatuses: asStringArray(['Completed', 'In Transit']),
          draftStatuses: asStringArray(['Completed', 'In Transit']),
          draftTypes: [],
        };

      default:
        return { openModal: null, dateFilter: null, selectedTypes: [], selectedStatuses: [] };
    }
  })();

  return <OrderListPage initialVariant={initialVariant} />;
};

export default OrderListsVariantPage;

