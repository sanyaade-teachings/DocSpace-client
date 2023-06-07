import React, { useState, useEffect, useTransition, Suspense } from "react";
import styled from "styled-components";

import HistoryFilterHeader from "./sub-components/HistoryFilterHeader";
import WebhookHistoryTable from "./sub-components/WebhookHistoryTable";
import { WebhookHistoryLoader } from "../sub-components/Loaders";

import { inject, observer } from "mobx-react";
import { useParams } from "react-router-dom";
import EmptyFilter from "./sub-components/EmptyFilter";

const WebhookWrapper = styled.div`
  width: 100%;
`;

const WebhookHistory = (props) => {
  const {
    historyItems,
    fetchHistoryItems,
    emptyCheckedIds,
    clearHistoryFilters,
  } = props;

  const [isFetchFinished, setIsFetchFinished] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { id } = useParams();

  const fetchItems = async () => {
    await fetchHistoryItems({
      configId: id,
      count: 30,
    });
    setIsFetchFinished(true);
  };

  useEffect(() => {
    startTransition(fetchItems);

    return clearHistoryFilters;
  }, []);

  const applyFilters = async ({ deliveryFrom, deliveryTo, groupStatus }) => {
    emptyCheckedIds();
    const params = { configId: id, deliveryFrom, deliveryTo, groupStatus, count: 30 };

    await fetchHistoryItems(params);
  };

  return (
    <WebhookWrapper>
      <Suspense fallback={<WebhookHistoryLoader />}>
        <main>
          <HistoryFilterHeader applyFilters={applyFilters} />
          {historyItems.length === 0 && isFetchFinished ? (
            <EmptyFilter applyFilters={applyFilters} />
          ) : (
            <WebhookHistoryTable />
          )}
        </main>
      </Suspense>
    </WebhookWrapper>
  );
};

export default inject(({ webhooksStore }) => {
  const {
    historyItems,
    fetchHistoryItems,
    emptyCheckedIds,
    clearHistoryFilters,
  } = webhooksStore;

  return {
    historyItems,
    fetchHistoryItems,
    emptyCheckedIds,
    clearHistoryFilters,
  };
})(observer(WebhookHistory));
