import React, { useEffect, useRef } from "react";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getDataFromAPI } from "../utils/api";
import { InfoOfUser, setInfoOfUser } from "../redux/infoOfUserSlice";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { setSelectedUserId } from "../redux/uiSlice";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 20px auto;
  padding: 24px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  font-family: Arial, sans-serif;
`;

// Строка для ключа и значения
const FieldRow = styled.div`
  display: flex;
  margin-top: 6px;
`;

// Стилизуем ключ (фиксированная ширина)
const FieldKey = styled.div`
  font-weight: 600;
  color: #4f46e5;
  min-width: 50px; /* одинаковая ширина для выравнивания */
`;

// Стилизуем значение (растягивается)
const FieldValue = styled.div`
  color: #111827;
  flex: 1;
`;

// Вложенные объекты с отступом
const Nested = styled.div`
  margin-left: 20px;
  margin-top: 4px;
`;

export const InfoOfUserPanel = () => {
  const { id } = useParams();

  const selectedUserId = useSelector(
    (state: RootState) => state.ui.selectedUserId
  );

  const controllerRef = useRef<AbortController | null>(null);

  const dispatch = useDispatch();

  const infoOfUser = useSelector(
    (state: RootState) => state.infoOfUser.infoOfUser
  );

  const getInfoOfUser = async () => {
    console.log(`test ${id}`);
    if (!id) return;
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    const url = "https://jsonplaceholder.typicode.com/users/";

    getDataFromAPI<InfoOfUser>(url, controllerRef.current.signal, { id }).then(
      (data) => {
        console.log(data);

        dispatch(setInfoOfUser(data[0]));
      }
    );
  };

  const renderObject = (obj: any): React.ReactNode =>
    Object.entries(obj).map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return (
          <Nested key={key}>
            <FieldRow>
              <FieldKey>{key}:</FieldKey>
            </FieldRow>
            {renderObject(value)}
          </Nested>
        );
      }
      return (
        <FieldRow key={key}>
          <FieldKey>{key}:</FieldKey>
          <FieldValue>{String(value)}</FieldValue>
        </FieldRow>
      );
    });

  useEffect(() => {
    getInfoOfUser();
    return () => {
      controllerRef.current?.abort();
    };
  }, [id]);

  return <Card> {infoOfUser && renderObject(infoOfUser)}</Card>;
};
