import { View, FlatList, Image } from "react-native";
import { Component } from "react";
import Container from "@/components/base/Container";
import TextBase from "@/components/base/Text";
import { Color, Size, Distance, BorderRadius } from "@/constants/Styles";
import ButtonBase from "@/components/base/Button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import IconButton from "@/components/base/IconButton";
import Header from "@/components/base/Header";
import { StoreProps, useStore } from "@/stores";
import { timeFormatter } from "@/utils/formatter";
import NotFound from "@/components/base/NotFound";

interface ScrollEvent {
  nativeEvent: {
    contentOffset: {
      x: number;
    };
  };
}

export class Detail extends Component<StoreProps> {
  state = {
    currentIndex: 0,
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

  render() {
    const screenWidth = Size.screen.width - Distance.default * 2; // Account for horizontal padding
    // A4 aspect ratio is 1:√2 (approximately 1:1.414)
    const a4Height = screenWidth * 1.414;

    return (
      <>
        <Container>
          <View
            style={{
              // height: Size.screen.height,
              paddingVertical: Distance.default,
              paddingHorizontal: Distance.default,
              gap: Distance.default,
            }}
          >
            {/* Header */}
            <Header title="Detail" />

            {/* Preview Image Section */}
            {this.props.documentStore.documents.length > 0 ? (
              <View
                style={{
                  width: screenWidth,
                  height: a4Height,
                  aspectRatio: 1 / 1.414, // A4 aspect ratio (width:height)
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
                    <View
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
                        onError={(error) =>
                          console.error("Error loading image:", error)
                        }
                      />
                      <View
                        style={{
                          height: 40,
                          // backgroundColor: Color.primary,
                        }}
                      >
                        <TextBase
                          variant="subcontent"
                          style={
                            {
                              // color: Color.white,
                            }
                          }
                        >
                          {item.type}
                        </TextBase>
                      </View>
                    </View>
                  )}
                />

                {/* Page Indicator */}
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
            )}

            {/* Detail Informasi */}
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
        {/* Tombol Aksi */}
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
          <IconButton
            style={{ backgroundColor: Color.secondary }}
            icon={
              <MaterialCommunityIcons
                name="share"
                size={24}
                color={Color.text}
              />
            }
            onPress={() => {}}
          />
        </View>
      </>
    );
  }
}

export default useStore(Detail);
