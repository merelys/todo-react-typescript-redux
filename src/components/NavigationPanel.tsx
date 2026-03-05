import React, { useEffect } from "react";
import styled from "styled-components";
import { IUser } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setSelectedUserId } from "../redux/uiSlice";
import {
  NavLink as RouterNavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { setUsers } from "../redux/usersSlice";
import { getDataFromAPI } from "../utils/api";

const Wrapper = styled.div`
  //font-size: px;

  display: flex;
  flex-flow: column;
  align-items: center;

  width: 620px;
  padding: 12px;
  margin: 0 auto;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
`;

const Select = styled.select`
  width: 250px;
  padding: 6px 12px;

  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;

  //font-size: 13px;
  color: #111827;
  text-align: left;

  transition: 0.2s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  }

  option {
    padding: 6px 12px;
  }
`;

const NavLinkStyledWrapper = styled.div``;

const NavLinkStyled = styled(RouterNavLink)`
  padding: 6px 14px;
  border-radius: 999px;
  text-decoration: none;

  font-size: 20px;
  cursor: pointer;
  width: 700;

  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    background: #4f46e5;
    color: #ffffff;
  }
`;

export const NavigationPanel: React.FC = ({}) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.value);
  const selectedUserId = useSelector(
    (state: RootState) => state.ui.selectedUserId
  );

  const location = useLocation();
  const navigate = useNavigate();

  const changeSelectedUserIdHandle = (id: number) => {
    console.log(`changeSelectedUserIdHandle id: ${id}`);
    dispatch(setSelectedUserId(id));

    if (id !== 0) {
      navigate(`/todo-react-typescript-redux/infoOfUser/${id}`);
    }
  };

  const getUsers = async (signal: AbortSignal) => {
    const url = "https://jsonplaceholder.typicode.com/users";
    getDataFromAPI<IUser>(url, signal).then((data) => {
      if (data.length > 0) {
        dispatch(setUsers(data));
        console.log(data);
      }
    });
  };

  //выполняется при загрузке страницы
  useEffect(() => {
    let controller = new AbortController();

    console.log("first getUsers");
    getUsers(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);
  return (
    <Wrapper>
      <Select
        value={selectedUserId}
        onChange={(e) => changeSelectedUserIdHandle(Number(e.target.value))}
      >
        {" "}
        <option value="0"> Choose user...</option>
        {users.map((user: IUser) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </Select>

      <NavLinkStyledWrapper>
        <NavLinkStyled
          to={{
            pathname: "/todo-react-typescript-redux",
            search: location.search,
          }}
        >
          Todos
        </NavLinkStyled>
        <NavLinkStyled
          to={{
            pathname: "/todo-react-typescript-redux/posts",
            search: location.search,
          }}
        >
          Posts
        </NavLinkStyled>
        <NavLinkStyled
          to={`/todo-react-typescript-redux/infoOfUser/${selectedUserId}`}
        >
          Info of user
        </NavLinkStyled>
      </NavLinkStyledWrapper>
    </Wrapper>
  );
};
