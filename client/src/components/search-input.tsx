import styled from '@emotion/styled'
import { UilSearch } from '@iconscout/react-unicons'
import React, { ReactNode } from 'react'

interface ISearchInputWithFiltersProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  children?: ReactNode
  m?: string
  p?: string
}

export function Search({
  value,
  onChange,
  placeholder,
  children,
  p = '0px 10px',
  m = '0'
}: ISearchInputWithFiltersProps) {
  const Wrap = styled.div`
    display: flex;
    justify-content: space-between;
    padding: ${p};
    margin: ${m};
    min-height: 40px;
    border-radius: var(--br);

    .filterWrappers {
      display: inline-flex;
      gap: 10px;
    }
  `
  const InputWrap = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    gap: 10px;

    svg {
      width: 18px;
      opacity: 0.3;
      transition: opacity 0.2s ease;
    }
    input {
      border: none;
      flex-grow: 1;
      height: 100%;
      background: transparent;
      font-size: 1.1rem;
    }
  `

  return (
    <Wrap>
      <InputWrap>
        <UilSearch />
        <input
          type="text"
          placeholder={placeholder}
          autoFocus={value !== ''}
          onChange={onChange}
          value={value}
        />
      </InputWrap>

      <div className="filterWrappers">{children}</div>
    </Wrap>
  )
}
