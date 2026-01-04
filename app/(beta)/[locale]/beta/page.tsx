import Image from 'next/image';
import Styles from './beta.module.scss';
import Link from 'next/link';
export default function BetaPage() {
  const topPages = [
    {
      id: 1,
      title: 'LATAM ROLA',
      slug: 'latam-rola',
      img: 'https://selectgame.gamehall.com.br/wp-content/uploads/2022/09/Ragnarok-Online-Stories-Wallpaper-Mobile-02.webp'
    },
    {
      id: 2,
      title: 'HISTORY REBORN',
      slug: 'history-reborn',
      img: 'https://wiki.historyreborn.org/images/9/9b/Exclusivos.png'
    },
    {
      id: 3,
      title: 'THOR',
      slug: 'thor',
      img: 'https://playragnarokonlinebr.com/img/guias/2017-08-22_oqueeragnarok.jpg'
    }
  ];
  return (
    <div className={Styles.main_tag}>
      <div>
        <Link href="/beta">
          <Image
            src="/assets/beta/temp3.png"
            alt="Beta Warning"
            width={300}
            height={300} />
        </Link>
      </div>
       <div className={Styles.all_server}>
        <button>
          Ver todos os jogos
        </button>
      </div>
      <div className={Styles.container_beta}>
        {topPages.map((page) => (
          <Link key={page.id} href={`/beta/${page.slug}`} className={Styles.beta_item} style={{ "--img": `url('${page.img}')` } as React.CSSProperties}>
            <h1>{page.title}</h1>
          </Link>
        ))}

      </div>
     
    </div>
  );
}