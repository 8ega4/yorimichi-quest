import { CaretLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export function PageHeader({ title, backTo }: { title: string; backTo?: string }) {
  const navigate = useNavigate();
  return (
    <header className="page-header">
      <button
        className="icon-button"
        type="button"
        aria-label="前の画面へ戻る"
        onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
      >
        <CaretLeft size={24} weight="bold" aria-hidden="true" />
      </button>
      <h1>{title}</h1>
      <span className="page-header__spacer" aria-hidden="true" />
    </header>
  );
}
