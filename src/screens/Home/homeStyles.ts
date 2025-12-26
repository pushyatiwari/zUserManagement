import { StyleSheet } from 'react-native';
export const TAB_WIDTH = 90;

export const homesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 999,
    padding: 4,
    marginRight: 12,
    position: 'relative',
  },

  activeIndicator: {
    position: 'absolute',
    left: 2,
    top: 1,
    height: 42,
    width: TAB_WIDTH + 5,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#2c6bed',
  },

  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
  },

  tabBtnActive: {
    borderWidth: 1,
    borderColor: '#2c6bed',
  },

  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 50,
  },

  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 999,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
  },

  searchButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  tabText: {
    color: '#444',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#2c6bed',
  },

  listContent: {
    paddingBottom: 24,
  },

  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#e9f1ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#2c6bed',
    fontWeight: '700',
  },

  name: {
    flex: 1,
    fontSize: 16,
    color: '#111',
  },

  role: {
    color: '#777',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#2c6bed',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabPlus: {
    color: '#fff',
    fontSize: 34,
    lineHeight: 34,
    fontWeight: '600',
    marginTop: -2,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 14,
  },
  addFormModalWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginTop:30,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
