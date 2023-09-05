import styled from "styled-components";

export const Container = styled.div`
  width: calc(100% - var(--sidebar-width));
  height: 100vh;
  margin-left: var(--sidebar-width);
  padding: 1rem;

  .flex-div {
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      border: 0;
      background: var(--green);
      padding: 0.375rem;
      border-radius: 0.25rem;
      color: var(--background);
      font-size: 1.125rem;

      transition: filter 0.2s;

      &:hover {
        filter: brightness(0.8);
      }
    }
  }

  table {
    border-collapse: collapse;
    margin: 1.5rem 0;
    min-width: 800px;
    width: 100%;

    thead tr {
      background: var(--green);
      color: var(--background);
      text-align: left;
    }

    th,
    td {
      padding: 0.75rem 0.9395rem;
      &:first-child {
        border-top-left-radius: 0.25rem;
        border-bottom-left-radius: 0.25rem;
      }
      &:last-child {
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
      }
    }
    tbody tr {
      transition: background 0.2s;
      cursor: pointer;

      .delete-trash {
        width: 10px;
        cursor: pointer;
        color: var(--red);
        font-size: 1.3rem;

        transition: background 0.2s;

        svg {
          margin: 0.2rem 0 0;
        }

        &:hover {
          background: var(--red);
        }
      }

      &:nth-of-type(even) {
        background: #d1d1d1;
      }

      &:last-of-type {
        border-bottom: 5px solid var(--green);
        border-radius: 5px;
      }

      &:hover {
        background: var(--green);
        color: var(--background);

        .delete-trash {
          color: var(--background);
        }
      }
    }

    .ellipsis-text {
      max-width: 300px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
`;
