import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Todo } from "./TodoList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";

const TodoItem = ({ todo }: { todo: Todo }) => {
  const queryClient = useQueryClient();

  const { mutate: updateTodo, isPending: isUpdating } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async () => {
      if (todo.completed) {
        return alert("Todo is already completed");
      }
      try {
        const res = await fetch(BASE_URL + `/todos/${todo._id}`, {
          method: "PATCH",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async () => {
      try {
        const res = await fetch(BASE_URL + `/todos/${todo._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <Box
      w="100%" // Full width for responsiveness
      display="flex"
      justifyContent="center" // Center horizontally
      mb={4} // Margin below each TodoItem
    >
      <Flex
        gap={4}
        alignItems="center"
        justifyContent="space-between"
        p={3}
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        boxShadow="sm"
        maxWidth="600px"
        w="100%"
        bg="white"
      >
        {/* Task and Status Badge */}
        <Flex direction="column" flex="1">
          <Text
            color={todo.completed ? "blue.400" : "red.400"} // Updated font color
            textDecoration={todo.completed ? "line-through" : "none"}
            fontWeight="bold"
          >
            {todo.body}
          </Text>
          <Badge
            mt={1}
            colorScheme={todo.completed ? "green" : "yellow"}
            w="fit-content"
          >
            {todo.completed ? "Done" : "In Progress"}
          </Badge>
        </Flex>

        {/* Action Icons */}
        <Flex gap={4} alignItems="center">
          {/* Update Todo Icon */}
          <Box
            color="green.500"
            cursor="pointer"
            onClick={() => updateTodo()}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {!isUpdating && <FaCheckCircle size={20} />}
            {isUpdating && <Spinner size="sm" />}
          </Box>
          {/* Delete Todo Icon */}
          <Box
            color="red.500"
            cursor="pointer"
            onClick={() => deleteTodo()}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {!isDeleting && <MdDelete size={25} />}
            {isDeleting && <Spinner size="sm" />}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default TodoItem;
