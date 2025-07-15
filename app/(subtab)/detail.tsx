import {
  View,
  FlatList,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Component } from "react";
import Container from "@/components/base/Container";
import TextBase from "@/components/base/Text";
import {
  Color,
  Size,
  Distance,
  BorderRadius,
  IsMobileScreen,
  ASPECT_RATIO,
} from "@/constants/Styles";
import ButtonBase from "@/components/base/Button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import IconButton from "@/components/base/IconButton";
import Header from "@/components/base/Header";
import { StoreProps, useStore } from "@/stores";
import { timeFormatter } from "@/utils/formatter";
import NotFound from "@/components/base/NotFound";
import { generateAndSharePdf } from "@/utils/PDF";
import { SpinnerIcon } from "@/components/animation/SpinnerIcon";
import { Image } from "expo-image";

interface ScrollEvent {
  nativeEvent: {
    contentOffset: {
      x: number;
    };
  };
}

export class DetailDocument extends Component<StoreProps> {
  state = {
    currentIndex: 0,
    isLoading: false,
    isModalVisible: false,
    selectedImageUri: "",
  };

  async componentDidMount() {
    const { selectedGroup } = this.props.groupStore;
    if (!selectedGroup) return console.error("Group not found");
    this.props.documentStore.syncDocumentsFromFirestore(selectedGroup.id);
  }

  handleScrollEnd = (e: ScrollEvent) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / Size.screen.width);
    this.setState({ currentIndex });
  };

  handleShare = async () => {
    if (this.state.isLoading) return;
    this.setState({ isLoading: true });
    await generateAndSharePdf(this.props.documentStore.documents);
    this.setState({ isLoading: false });
  };

  openImageModal = (imageUri: string) => {
    this.setState({ isModalVisible: true, selectedImageUri: imageUri });
  };

  closeImageModal = () => {
    this.setState({ isModalVisible: false, selectedImageUri: "" });
  };

  render() {
    const screenWidth = Size.screen.width - Distance.default * 2;
    const a4Height = screenWidth * 1.414;

    return (
      <>
        <Container>
          <View
            style={{
              paddingVertical: Distance.default,
              paddingHorizontal: Distance.default,
              gap: Distance.default,
            }}
          >
            <Header title="Detail" />

            {IsMobileScreen &&
              (this.props.documentStore.documents.length > 0 ? (
                <View
                  style={{
                    width: screenWidth,
                    height: a4Height,
                    aspectRatio: 1 / 1.414,
                    alignSelf: "center",
                  }}
                >
                  <FlatList
                    data={this.props.documentStore.documents}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this.handleScrollEnd}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => this.openImageModal(item.image_url)}
                        style={{
                          width: screenWidth,
                          height: a4Height,
                          backgroundColor: Color.greyLight,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: BorderRadius.default,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          source={{ uri: item.image_url }}
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "cover",
                          }}
                        />
                        <View
                          style={{
                            height: 40,
                          }}
                        >
                          <TextBase variant="subcontent">{item.type}</TextBase>
                        </View>
                      </Pressable>
                    )}
                  />

                  <View
                    style={{
                      position: "absolute",
                      bottom: -20,
                      left: 0,
                      right: 0,
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    {this.props.documentStore.documents.map((_, index) => (
                      <View
                        key={index}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor:
                            index === this.state.currentIndex
                              ? Color.primary
                              : Color.greyLight,
                        }}
                      />
                    ))}
                  </View>
                </View>
              ) : (
                <NotFound title="Tidak ada dokumen." />
              ))}

            <View style={{ flexDirection: "row", gap: 25, flexWrap: "wrap" }}>
              {!IsMobileScreen &&
                this.props.documentStore.documents.length > 0 &&
                this.props.documentStore.documents.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => this.openImageModal(item.image_url)}
                    style={{
                      width: 150,
                      aspectRatio: ASPECT_RATIO.A4,
                      backgroundColor: Color.greyLight,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: BorderRadius.default,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{ uri: item.image_url }}
                      style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover",
                      }}
                    />
                    <View
                      style={{
                        height: 40,
                      }}
                    >
                      <TextBase
                        variant="subcontent"
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {item.type}
                      </TextBase>
                    </View>
                  </Pressable>
                ))}
            </View>

            <View
              style={{
                flex: 1,
                gap: Distance.default,
                marginTop: 20,
              }}
            >
              <View>
                <TextBase variant="header">ID Pelanggan</TextBase>
                <TextBase variant="content">
                  {this.props.groupStore.selectedGroup?.customerId}
                </TextBase>
              </View>

              <View>
                <TextBase variant="header">Jumlah</TextBase>
                <TextBase variant="content">
                  {this.props.documentStore.documents.length} Halaman
                </TextBase>
              </View>

              <View>
                <TextBase variant="header">Tanggal update</TextBase>
                <TextBase variant="content">
                  {this.props.groupStore.selectedGroup?.updatedAt &&
                    timeFormatter(
                      this.props.groupStore.selectedGroup.updatedAt?.toDate()
                    )}
                </TextBase>
              </View>
            </View>
          </View>
        </Container>
        <View
          style={{
            flexDirection: "row",
            gap: Distance.default,
            paddingVertical: Distance.default,
            paddingHorizontal: Distance.default,
            backgroundColor: Color.background,
          }}
        >
          <ButtonBase
            style={{ flex: 1 }}
            textStyle={{ color: Color.text }}
            title="Edit"
            onPress={() => router.push("/(subtab)/edit")}
          />
          {/* <IconButton
            style={{
              backgroundColor: Color.secondary,
              opacity: this.state.isLoading ? 0.5 : 1,
            }}
            icon={
              !this.state.isLoading ? (
                <MaterialCommunityIcons
                  name="share"
                  size={24}
                  color={Color.text}
                />
              ) : (
                <SpinnerIcon size={24} color={Color.text} />
              )
            }
            onPress={this.handleShare}
          /> */}
        </View>

        <Modal
          visible={this.state.isModalVisible}
          transparent={true}
          onRequestClose={this.closeImageModal}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={this.closeImageModal}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: this.state.selectedImageUri }}
                style={{
                  height: Size.screen.height * 0.9,
                  width: Size.screen.width * 0.9,
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
            <View style={{ position: "absolute", top: 50, right: 20 }}>
              <IconButton
                icon={
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={30}
                    color={Color.white}
                  />
                }
                onPress={this.closeImageModal}
              />
            </View>
          </Pressable>
        </Modal>
      </>
    );
  }
}

export default useStore(DetailDocument);
