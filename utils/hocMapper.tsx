// hocMapper.tsx
import React from "react";

// Tipe untuk store yang memiliki state dan subscribe
type Store<T> = {
  getState: () => T;
  subscribe: (listener: (state: T) => void) => () => void;
};

// Fungsi untuk membuat HOC yang menggabungkan multiple store
const hocMapper = <Stores extends Record<string, Store<any>>>(
  stores: Stores
) => {
  return <P extends object>(
    WrappedComponent: React.ComponentType<
      P & { [K in keyof Stores]: ReturnType<Stores[K]["getState"]> }
    >
  ) => {
    return class WithCombinedStore extends React.Component<P> {
      unsubscribers: (() => void)[] = [];

      state = Object.keys(stores).reduce((acc, key) => {
        (acc as any)[key] = stores[key].getState();
        return acc;
      }, {} as { [K in keyof Stores]: ReturnType<Stores[K]["getState"]> });

      componentDidMount() {
        this.unsubscribers = Object.keys(stores).map((key) => {
          return stores[key].subscribe((state) => {
            this.setState({ [key]: state });
          });
        });
      }

      componentWillUnmount() {
        this.unsubscribers.forEach((unsubscribe) => unsubscribe());
      }

      render() {
        return <WrappedComponent {...this.props} {...this.state} />;
      }
    };
  };
};

export default hocMapper;
