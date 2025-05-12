import { View, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import TextBase from "@/components/base/Text";
import HistoryItem from "@/components/list/HistoryItem";
import { dateFormatter, timeFormatter } from "@/utils/formatter";
import { documentService, groupService, userService } from "@/services";
import useGroupStore from "@/stores/Group";
import { router } from "expo-router";
import { StoreProps, useStore } from "@/stores";
import NotFound from "@/components/base/NotFound";
import { showConfirm } from "@/utils/alert";
import { BorderRadius, Color, IsMobileScreen } from "@/constants/Styles";
import IconButton from "@/components/base/IconButton";
import Feather from "@expo/vector-icons/Feather";

export class HomeHistory extends Component<StoreProps> {
  state = {
    currentPage: 1,
  };

  async componentDidMount() {
    const userData = userService.getCurrentUser();
    if (!userData || !userData.id)
      return console.error("User data is missing or incomplete.");

    let groups;
    if (userData.role === "user")
      groups = await groupService.getGroupsByCreator(userData.id);
    if (userData.role !== "user") groups = await groupService.getAllGroups();
    if (!groups) return console.error("No groups found.");
    this.props.groupStore.setGroups(groups);
  }

  handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      "Hapus",
      "Apakah Anda yakin ingin menghapus riwayat ini?"
    );
    if (!confirmed) return;

    // Fetch all documents for the group and delete them in parallel
    const docs = await documentService.getDocumentsByGroupId(id);

    // delete the image in cloudinary
    await Promise.all(
      docs.map((doc) => {
        if (doc.image_public_id) {
          // delete using server
          fetch(
            `${
              process.env.EXPO_PUBLIC_API_ENDPOINT
            }/cloudinary?public_id=${encodeURIComponent(doc.image_public_id)}`,
            {
              method: "DELETE",
            }
          );
          return;
        }
        return Promise.resolve();
      })
    );

    // delete the doc
    await documentService.deleteDocumentsByGroupId(id);

    await groupService.deleteGroup(id);
    this.props.groupStore.removeGroup(id);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(
      this.props.groupStore.groups.length / itemsPerPage
    );
    if (this.state.currentPage > totalPages) {
      this.setState({ currentPage: totalPages });
    }
  };

  handleAddNew = () => {
    this.props.documentStore.clearDocuments();
    this.props.groupStore.clearSelectedGroup();
    documentService.handleScanDocument();
  };

  render() {
    const { currentPage } = this.state;
    const itemsPerPage = 9;
    const totalPages = Math.ceil(
      this.props.groupStore.groups.length / itemsPerPage
    );
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const displayedGroups = this.props.groupStore.groups.slice(start, end);

    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 4;
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (endPage - startPage < maxPagesToShow - 1) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        } else {
          startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (startPage > 1) {
        pages.unshift("...");
        pages.unshift(1);
      }
      if (endPage < totalPages) {
        pages.push("...");
        pages.push(totalPages);
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 10,
            alignItems: "center",
          }}
        >
          <TextBase variant="header">Riwayat</TextBase>

          {!IsMobileScreen && (
            <IconButton
              onPress={this.handleAddNew}
              icon={
                <Feather
                  name="plus"
                  size={IsMobileScreen ? 18 : 20}
                  color={Color.text}
                />
              }
              size="small"
            />
          )}
        </View>

        {this.props.groupStore.groups.length === 0 ? (
          <NotFound />
        ) : (
          <>
            <View>
              {displayedGroups.map((item, index) => (
                <HistoryItem
                  key={item.id}
                  id={item.id ?? ""}
                  costumerId={item.customerId ?? ""}
                  fileCount={item.documentCount}
                  date={dateFormatter.format(
                    item.createdAt instanceof Date
                      ? item.createdAt
                      : item.createdAt.toDate()
                  )}
                  time={timeFormatter(item.createdAt.toDate())}
                  index={index}
                  onPress={() => {
                    useGroupStore.getState().setSelectedGroup(item);
                    router.push("/(subtab)/detail");
                  }}
                  onDelete={this.handleDelete}
                />
              ))}
            </View>

            {/* Pagination */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                marginBottom: IsMobileScreen ? 100 : 50,
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ currentPage: currentPage - 1 })}
                disabled={currentPage === 1}
                style={{
                  borderTopLeftRadius: BorderRadius.default,
                  borderBottomLeftRadius: BorderRadius.default,
                  padding: 10,
                  backgroundColor:
                    currentPage === 1 ? Color.greyLight : Color.primary,
                }}
              >
                <TextBase style={{ color: Color.text }}>Previous</TextBase>
              </TouchableOpacity>

              {pageNumbers.map((page, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    typeof page === "number" &&
                    this.setState({ currentPage: page })
                  }
                  style={{
                    padding: 10,
                    backgroundColor:
                      page === currentPage ? Color.primary : Color.greyLight,
                  }}
                  disabled={typeof page !== "number"}
                >
                  <TextBase style={{ color: Color.text }}>{page}</TextBase>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => this.setState({ currentPage: currentPage + 1 })}
                disabled={currentPage === totalPages}
                style={{
                  padding: 10,
                  borderTopRightRadius: BorderRadius.default,
                  borderBottomRightRadius: BorderRadius.default,
                  backgroundColor:
                    currentPage === totalPages
                      ? Color.greyLight
                      : Color.primary,
                }}
              >
                <TextBase style={{ color: Color.text }}>Next</TextBase>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  }
}

export default useStore(HomeHistory);
