import styled from '@emotion/styled'

export const ERPRootTable = styled.div`
  /* Table Container */
  border: 1px solid var(--L2);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  background: var(--L1);
  position: relative;
  overflow-x: auto;

  /* Main Table */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  /* Header */
  thead {
    background-color: var(--L2);
    border-bottom: 2px solid var(--L3);

    tr {
      border-top: 1px solid var(--L3);
    }

    th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-weight: 600;
      color: rgb(135, 141, 150);
      border-right: 1px solid var(--L2);

      &:last-child {
        border-right: none;
      }
    }
  }

  /* Body */
  tbody {
    tr {
      border-bottom: 1px solid var(--L2);
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--L2);
      }

      &:nth-child(even) {
        background-color: var(--L1);

        &:hover {
          background-color: var(--L2);
        }
      }

      td {
        padding: 0.1rem 1rem;
        color: var(--lowContrast);
        border-right: 1px solid var(--L2);

        &:last-child {
          border-right: none;
        }
      }
    }
  }

  /* Compact Variant */
  &.compact {
    th,
    td {
      padding: 0.5rem 0.75rem;
    }
  }

  /* Pagination */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-top: 1px solid var(--L2);
    background-color: var(--L1);

    button {
      padding: 0.375rem 0.75rem;
      border: 1px solid var(--L2);
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background-color: var(--L2);
        border-color: var(--L2);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }

  @media (max-width: 768px) {
    border-left: 1px solid var(--L2);
    border-right: 1px solid var(--L2);
  }
`
