import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;

  height: 100%;
  width: var(--sidebar-width);
  padding: 1rem;
  background: var(--primary);
  color: var(--background);

  img {
    width: 100%;
    height: 200px;
    object-fit: contain;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  a {
    display: inline-block;

    text-align: center;
    color: var(--background);

    background: var(--green);
    padding: 0.6rem;
    border: 0;
    border-radius: 0.25rem;
    width: 100%;
    font-size: 1.5rem;

    transition: filter 0.2s;

    + a {
      margin-top: 1rem;
    }

    &:hover {
      filter: brightness(0.8);
    }
  }

  .footer-text {
    text-align: center;
  }
`;
