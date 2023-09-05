import styled from "styled-components";

export const MyButton = styled.button`
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
`;
