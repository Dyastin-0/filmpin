import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "../hooks/useModal";
import CreateList from "../CreateList";
import UserList from "../UserList";
import useList from "../../hooks/useList";
import { useEffect } from "react";

const ListSection = ({ userData }) => {
  const { token, user } = useAuth();
  const { setModal, setOpen } = useModal();
  const { list, isLoading } = useList({ userData });

  useEffect(() => {
    console.log(list);
  }, [list]);

  if (!token) {
    <motion.section
      initial={{ marginTop: -70 }}
      className="flex justify-center items-center gap-4 w-full bg-accent rounded-md"
    >
      <h1 className="text-xs text-primary-foreground font-semibold">{`Sign in to view ${userData?.username}'s lists.`}</h1>
    </motion.section>;
  }

  return (
    <motion.section
      initial={{ marginTop: -70 }}
      className="relative flex flex-col gap-4 w-full z-10"
    >
      <div className="flex w-fit justify-center items-center gap-2">
        <h1 className="h-fit text-primary-foreground text-sm font-semibold">
          Lists
        </h1>
        {token && user?.username === userData?.username && (
          <Button
            className="w-fit"
            onClick={() => {
              setModal(<CreateList />);
              setOpen(true);
            }}
            icon={<FontAwesomeIcon icon={faPlus} />}
            text="Create"
          />
        )}
      </div>
      <div className="flex flex-wrap justify-center w-full gap-4">
        {!isLoading && list?.length > 0 ? (
          list.map((item) => <UserList key={item._id} list={item} />)
        ) : (
          <p className="text-xs text-secondary-foreground">No lists yet.</p>
        )}
      </div>
    </motion.section>
  );
};

export default ListSection;
